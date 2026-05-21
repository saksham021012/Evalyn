import dotenv from 'dotenv';
import {
  ServerOptions,
  cli,
  defineAgent,
  inference,
  voice,
  llm
} from '@livekit/agents';
import * as openai from '@livekit/agents-plugin-openai';
import * as livekit from '@livekit/agents-plugin-livekit';
import { fileURLToPath } from 'url';
import Groq from 'groq-sdk';

import { connectDB } from './config/db.js';
import Interview from './models/Interview.js';
import Resume from './models/Resume.js';
import { evaluateAnswer, generateInterviewSummary } from './controllers/aiController.js';

dotenv.config();

// Establish DB connection for the agent worker process
connectDB();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Helper to parse JSON from Groq response
function parseJSON(text) {
  try {
    const startBrace = text.indexOf('{');
    const startBracket = text.indexOf('[');
    let start = -1;
    if (startBrace !== -1 && startBracket !== -1) {
      start = Math.min(startBrace, startBracket);
    } else {
      start = startBrace !== -1 ? startBrace : startBracket;
    }
    const endBrace = text.lastIndexOf('}');
    const endBracket = text.lastIndexOf(']');
    const end = Math.max(endBrace, endBracket);
    if (start === -1 || end === -1 || end < start) {
      throw new Error("No JSON found");
    }
    return JSON.parse(text.substring(start, end + 1));
  } catch (e) {
    console.error('parseJSON error on content:', text);
    return [];
  }
}

// Function to process transcripts and update the MongoDB interview record
async function finalizeInterview(interviewId, session) {
  try {
    console.log(`[Agent] Finalizing interview ${interviewId}...`);
    const interview = await Interview.findById(interviewId).populate('resume');
    if (!interview) {
      console.error(`[Agent] Interview ${interviewId} not found in database`);
      return;
    }

    if (interview.status === 'completed') {
      console.log('[Agent] Interview is already marked as completed');
      return;
    }

    const history = session.history;
    if (!history || !history.items) {
      console.log('[Agent] No conversation history found in AgentSession');
      return;
    }

    const conversation = [];
    for (const item of history.items) {
      if (item.type === 'message' && (item.role === 'user' || item.role === 'assistant')) {
        conversation.push({
          role: item.role,
          text: item.textContent || ''
        });
      }
    }

    if (conversation.length === 0) {
      console.log('[Agent] Conversation text log is empty');
      return;
    }

    console.log(`[Agent] Extracting Q&A turns from ${conversation.length} dialog items...`);

    const prompt = `You are an expert interview analyzer. You are given a conversation log of a voice technical interview between an AI Interviewer (role: assistant) and a candidate (role: user).
Please analyze this transcript and extract the distinct question-answer turns.
Ignore simple introductory greetings, pleasantries, filler phrases, interruptions, and final goodbyes.
For each distinct question asked by the interviewer, extract:
1. The question text (clean and polished).
2. The candidate's response to that question (if any).
3. The type of question ("technical", "behavioral", "project-based", "resume-based", or "problem-solving").
4. The difficulty of the question ("easy", "medium", or "hard").
5. The skills or technologies relevant to this question.

Transcript:
${JSON.stringify(conversation, null, 2)}

Return ONLY a valid JSON array of objects with the following structure:
[
  {
    "questionText": "Question text...",
    "answerTranscript": "Candidate's response transcript...",
    "questionType": "technical|behavioral|project-based|resume-based|problem-solving",
    "difficulty": "easy|medium|hard",
    "relatedSkills": ["skill1", "skill2"]
  }
]`;

    let qaPairs = [];
    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
        temperature: 0.1
      });
      const responseContent = completion.choices[0]?.message?.content || '[]';
      qaPairs = parseJSON(responseContent);
    } catch (err) {
      console.error('[Agent] Failed to extract QA pairs using Groq, using fallback:', err);
      qaPairs = [{
        questionText: "General interview conversation",
        answerTranscript: conversation.map(c => `${c.role}: ${c.text}`).join('\n'),
        questionType: "technical",
        difficulty: interview.difficulty,
        relatedSkills: []
      }];
    }

    console.log(`[Agent] Extracted ${qaPairs.length} QA pairs. Starting evaluations...`);

    const evaluatedQuestions = [];
    let totalScore = 0;
    let questionsAnswered = 0;

    for (let i = 0; i < qaPairs.length; i++) {
      const qa = qaPairs[i];
      const questionData = {
        questionText: qa.questionText,
        questionType: qa.questionType,
        difficulty: qa.difficulty,
        relatedSkills: qa.relatedSkills || []
      };

      console.log(`[Agent] Evaluating question ${i + 1}/${qaPairs.length}...`);
      const evalResult = await evaluateAnswer(questionData, qa.answerTranscript, interview.resume.parsedData);
      
      const questionObj = {
        questionNumber: i + 1,
        questionText: qa.questionText,
        questionType: qa.questionType,
        difficulty: qa.difficulty,
        relatedSkills: qa.relatedSkills || [],
        answer: {
          transcript: qa.answerTranscript || '',
          submittedAt: new Date()
        },
        evaluation: evalResult.success ? {
          score: evalResult.evaluation.score,
          feedback: evalResult.evaluation.feedback,
          strengths: evalResult.evaluation.strengths,
          weaknesses: evalResult.evaluation.weaknesses,
          suggestions: evalResult.evaluation.suggestions,
          matchesResumeClaim: evalResult.evaluation.matchesResumeClaim,
          resumeClaimVerified: evalResult.evaluation.resumeClaimVerified,
          evaluatedAt: new Date()
        } : {
          score: 0,
          feedback: 'Evaluation failed',
          strengths: [],
          weaknesses: [],
          suggestions: [],
          matchesResumeClaim: false,
          resumeClaimVerified: '',
          evaluatedAt: new Date()
        },
        askedAt: new Date(),
        timeSpent: 0,
        skipped: false,
        reRecorded: false
      };

      evaluatedQuestions.push(questionObj);
      if (evalResult.success && evalResult.evaluation.score !== undefined) {
        totalScore += evalResult.evaluation.score;
        questionsAnswered++;
      }
    }

    interview.questions = evaluatedQuestions;
    interview.stats.totalQuestions = evaluatedQuestions.length;
    interview.stats.questionsAnswered = questionsAnswered;
    interview.stats.questionsSkipped = 0;
    interview.stats.averageScore = questionsAnswered > 0 ? (totalScore / questionsAnswered) : 0;

    console.log('[Agent] Generating overall summary report...');
    const summaryResult = await generateInterviewSummary(interview, interview.resume.parsedData);
    if (summaryResult.success) {
      interview.overallEvaluation = summaryResult.summary;
    }

    interview.status = 'completed';
    interview.completedAt = new Date();

    await interview.save();
    console.log(`[Agent] ✅ Interview ${interviewId} evaluation complete & results saved to database.`);
  } catch (err) {
    console.error('[Agent] Error during finalizeInterview:', err);
  }
}

export default defineAgent({
  entry: async (ctx) => {
    // Connect first so ctx.room.name and other room metadata are available
    await ctx.connect();
    console.log(`[Agent] Job started for room: ${ctx.room.name}`);

    // Parse the interview ID from the room name
    const roomName = ctx.room.name;
    if (!roomName) {
      console.error('[Agent] ctx.room.name is undefined after connect. Exiting.');
      return;
    }
    const match = roomName.match(/^interview_(.+)$/);
    if (!match) {
      console.error(`[Agent] Invalid room name: ${roomName}. Expecting 'interview_<id>'`);
      return;
    }
    const interviewId = match[1];

    // Fetch interview parameters from MongoDB
    let systemPrompt = '';
    let candidateName = 'Candidate';
    try {
      const interview = await Interview.findById(interviewId).populate('resume');
      if (!interview) {
        console.error(`[Agent] Interview ${interviewId} not found in DB`);
        return;
      }
      
      const role = interview.role;
      const difficulty = interview.difficulty;
      const resume = interview.resume;
      const parsedData = resume?.parsedData;
      candidateName = parsedData?.name || 'Candidate';
      const experienceLevel = parsedData?.experienceLevel || 'not specified';
      const skills = parsedData?.skills?.map(s => s.name).join(', ') || '';
      const projects = parsedData?.projects?.map(p => p.name).join(', ') || '';

      systemPrompt = `You are a professional and friendly AI technical interviewer conducting a live voice interview.
You are interviewing ${candidateName} for a ${difficulty}-level ${role} position.

Candidate background:
Experience: ${experienceLevel}
Skills: ${skills}
Projects: ${projects}

How to conduct the interview:
Ask one question at a time. Keep each question short and conversational, like something you would say out loud. Wait for the answer before moving on.
Ask around 6 to 8 questions total. Mix technical questions, questions about their projects, and a light problem-solving scenario relevant to the role.
If an answer is vague or incomplete, ask a short follow-up. If something seems off compared to their background, probe gently.
When you have enough to evaluate the candidate, wrap up naturally. Thank them and wish them well.

Tone and format rules:
Speak in short, natural sentences. No markdown, no bullet points, no asterisks, no symbols of any kind. Everything you say will be read aloud, so write exactly as you would speak. Avoid long compound sentences. One idea at a time.

Begin by greeting ${candidateName} warmly, introducing yourself as their AI interviewer, and jumping straight into your first question.`;

      // Update interview status to in-progress
      interview.status = 'in-progress';
      interview.startedAt = new Date();
      await interview.save();
      console.log(`[Agent] Interview ${interviewId} marked as in-progress.`);
    } catch (err) {
      console.error('[Agent] Failed to load interview config from DB:', err);
      return;
    }

    const agent = new voice.Agent({
      instructions: systemPrompt
    });

    const session = new voice.AgentSession({
      stt: new inference.STT({ model: 'deepgram/nova-3', language: 'en' }),
      llm: openai.LLM.withGroq({
        model: 'llama-3.1-8b-instant',
        apiKey: process.env.GROQ_API_KEY
      }),
      tts: new inference.TTS({
        model: 'cartesia/sonic-3',
        voice: '9626c31c-bec5-4cca-baa8-f8ba9e84c8bc'
      }),
      turnHandling: {
        turnDetection: 'stt',
        endpointing: {
          minDelay: 300,
          maxDelay: 2000
        }
      }
    });

    // Finalize logic flag
    let finalized = false;
    const handleFinalize = async () => {
      if (finalized) return;
      finalized = true;
      console.log(`[Agent] Finalizing interview session for room: ${roomName}`);
      await finalizeInterview(interviewId, session);
    };

    ctx.room.on('disconnected', () => {
      console.log('[Agent] Room disconnected.');
      handleFinalize();
    });

    ctx.room.on('trackSubscribed', (track, publication, participant) => {
      console.log(`[Agent] Track subscribed: ${track.sid} (${track.kind}) from participant: ${participant.identity}`);
    });
    ctx.room.on('trackPublished', (publication, participant) => {
      console.log(`[Agent] Track published: ${publication.sid} (${publication.kind}) by participant: ${participant.identity}`);
    });

    session.on('close', () => {
      console.log('[Agent] Agent session closed.');
      handleFinalize();
    });

    session.on('error', (err) => {
      console.error('[Agent] Session error:', err);
    });

    session.on(voice.AgentSessionEventTypes.AgentStateChanged, (state) => {
      console.log(`[Agent] Agent state changed to: ${state}`);
    });
    
    session.on(voice.AgentSessionEventTypes.UserStateChanged, (state) => {
      console.log(`[Agent] User state changed to: ${state}`);
    });
    
    session.on(voice.AgentSessionEventTypes.UserInputTranscribed, (event) => {
      console.log(`[Agent] Transcribed [isFinal: ${event.isFinal}]: "${event.transcript}"`);
    });

    // Start session (room already connected above)
    await session.start({
      agent,
      room: ctx.room,
    });

    console.log('[Agent] Session started, generating greeting reply...');

    // Generate initial greeting & first question
    await session.generateReply({
      instructions: `Warmly greet ${candidateName}, introduce yourself as their AI technical interviewer, and ask the first technical question.`,
    });
  },
});

// Run agent runner CLI
cli.runApp(new ServerOptions({ agent: fileURLToPath(import.meta.url) }));
