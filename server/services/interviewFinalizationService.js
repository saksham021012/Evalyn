import Groq from 'groq-sdk';
import pLimit from 'p-limit';
import Interview from '../models/Interview.js';
import { evaluateAnswer, generateInterviewSummary } from './aiService.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Helper to parse JSON from Groq response
export function parseJSON(text) {
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
export async function finalizeInterview(interviewId, session) {
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

    // Set status to grading and progress to 10 immediately
    interview.status = 'grading';
    interview.gradingProgress = 10;
    await interview.save();

    // Snapshot history immediately before any async DB calls
    const historyItems = session?.history?.items ? [...session.history.items] : [];
    if (historyItems.length === 0) {
      console.log('[Agent] No conversation history found in AgentSession');
      interview.status = 'completed';
      interview.gradingProgress = 100;
      interview.completedAt = new Date();
      await interview.save();
      return;
    }

    const conversation = [];
    for (const item of historyItems) {
      if (item.type === 'message' && (item.role === 'user' || item.role === 'assistant')) {
        conversation.push({
          role: item.role,
          text: item.textContent || ''
        });
      }
    }

    if (conversation.length < 3) {
      console.log(`[Agent] Conversation too short to evaluate (length: ${conversation.length}), skipping.`);
      interview.status = 'completed';
      interview.gradingProgress = 100;
      interview.completedAt = new Date();
      await interview.save();
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

    // Update progress to 25% after extraction is completed
    try {
      await Interview.findByIdAndUpdate(interviewId, { gradingProgress: 25 });
    } catch (dbErr) {
      console.error('[Agent] Failed to update progress to 25%:', dbErr);
    }

    console.log(`[Agent] Extracted ${qaPairs.length} QA pairs. Starting parallel evaluations...`);

    const limit = pLimit(1);

    const evaluatedQuestions = await Promise.all(
      qaPairs.map((qa, i) => limit(async () => {
        console.log(`[Agent] Evaluating question ${i + 1}/${qaPairs.length}...`);
        const questionData = {
          questionText: qa.questionText,
          questionType: qa.questionType,
          difficulty: qa.difficulty,
          relatedSkills: qa.relatedSkills || []
        };
        const evalResult = await evaluateAnswer(questionData, qa.answerTranscript, interview.resume.parsedData);
        
        // Update database progress incrementally during grading (ranging from 25% to 80%)
        const currentProgress = 25 + Math.round(((i + 1) / qaPairs.length) * 55);
        try {
          await Interview.findByIdAndUpdate(interviewId, { gradingProgress: currentProgress });
        } catch (progErr) {
          console.error('[Agent] Failed to update incremental grading progress:', progErr);
        }

        return {
          questionNumber: i + 1,
          questionText: qa.questionText,
          questionType: qa.questionType,
          difficulty: qa.difficulty,
          relatedSkills: qa.relatedSkills || [],
          answer: { transcript: qa.answerTranscript || '', submittedAt: new Date() },
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
            score: 0, feedback: 'Evaluation failed', strengths: [], weaknesses: [],
            suggestions: [], matchesResumeClaim: false, resumeClaimVerified: '', evaluatedAt: new Date()
          },
          askedAt: new Date(),
          timeSpent: 0,
          skipped: false,
          reRecorded: false,
          _evalScore: evalResult.success ? evalResult.evaluation.score : undefined,
          _evalSuccess: evalResult.success
        };
      }))
    );

    let totalScore = 0;
    let questionsAnswered = 0;
    for (const q of evaluatedQuestions) {
      if (q._evalSuccess && q._evalScore !== undefined) {
        totalScore += q._evalScore;
        questionsAnswered++;
      }
    }

    // Refetch the document to ensure we have the latest state before saving evaluations
    const freshInterview = await Interview.findById(interviewId);
    if (!freshInterview) {
      console.error(`[Agent] Refetched interview ${interviewId} not found in DB`);
      return;
    }

    const questionsToSave = evaluatedQuestions.map(({ _evalScore, _evalSuccess, ...q }) => q);
    freshInterview.questions = questionsToSave;
    freshInterview.stats.totalQuestions = evaluatedQuestions.length;
    freshInterview.stats.questionsAnswered = questionsAnswered;
    freshInterview.stats.questionsSkipped = 0;
    freshInterview.stats.averageScore = questionsAnswered > 0 ? (totalScore / questionsAnswered) : 0;
    freshInterview.gradingProgress = 90;
    await freshInterview.save();

    console.log('[Agent] Generating overall summary report...');
    const summaryResult = await generateInterviewSummary(freshInterview, freshInterview.resume.parsedData);
    if (summaryResult.success) {
      freshInterview.overallEvaluation = summaryResult.summary;
    }

    freshInterview.status = 'completed';
    freshInterview.gradingProgress = 100;
    freshInterview.completedAt = new Date();

    await freshInterview.save();
    console.log(`[Agent] ✅ Interview ${interviewId} evaluation complete & results saved to database.`);
  } catch (err) {
    console.error('[Agent] Error during finalizeInterview:', err);
    try {
      const interview = await Interview.findById(interviewId);
      if (interview && interview.status !== 'completed') {
        interview.status = 'completed';
        interview.gradingProgress = 100;
        interview.completedAt = new Date();
        await interview.save();
        console.log(`[Agent] Fallback: Marked interview ${interviewId} as completed after finalization error.`);
      }
    } catch (saveErr) {
      console.error('[Agent] Failed to mark session as completed during error fallback:', saveErr);
    }
  }
}
