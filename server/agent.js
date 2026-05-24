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
import * as silero from '@livekit/agents-plugin-silero';
import { fileURLToPath } from 'url';
import Groq from 'groq-sdk';
import pLimit from 'p-limit';

import { connectDB } from './config/db.js';
import Interview from './models/Interview.js';
import Resume from './models/Resume.js';
import { evaluateAnswer, generateInterviewSummary } from './services/aiService.js';
import { buildInterviewPrompt } from './utils/promptBuilder.js';
import { finalizeInterview } from './services/interviewFinalizationService.js';

dotenv.config();

// Establish DB connection for the agent worker process
connectDB();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Agent logic starts here
let globalFinalizeHandler = null;
process.on('SIGTERM', () => {
  console.log('[Agent] SIGTERM received, finalizing...');
  if (globalFinalizeHandler) globalFinalizeHandler();
});

export default defineAgent({
  prewarm: async (proc) => {
    // We still prewarm the model so it downloads and caches the weights
    proc.userData.vad = await silero.VAD.load({
      activationThreshold: 0.5,
      minSpeechDuration: 250,
      minSilenceDuration: 500,
    });
  },
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
    let role = 'Software Engineer';
    try {
      const interview = await Interview.findById(interviewId).populate('resume');
      if (!interview) {
        console.error(`[Agent] Interview ${interviewId} not found in DB`);
        return;
      }

      role = interview.role || role;
      const difficulty = interview.difficulty;
      const resume = interview.resume;
      const parsedData = resume?.parsedData;
      candidateName = parsedData?.name || 'Candidate';
      const experienceLevel = parsedData?.experienceLevel || 'not specified';
      const skills = parsedData?.skills?.map(s => s.name).join(', ') || '';
      const projects = parsedData?.projects?.map(p => p.name).join(', ') || '';

      systemPrompt = buildInterviewPrompt({
        candidateName,
        role,
        difficulty,
        experienceLevel,
        skills,
        projects
      });

      // Update interview status to in-progress
      interview.status = 'in-progress';
      interview.startedAt = new Date();
      await interview.save();
      console.log(`[Agent] Interview ${interviewId} marked as in-progress.`);
    } catch (err) {
      console.error('[Agent] Failed to load interview config from DB:', err);
      return;
    }

    // Reuse prewarmed VAD — do NOT load a second one. Added fallback to prevent hard crashes.
    const vad = ctx.proc?.userData?.vad ?? await silero.VAD.load({
      activationThreshold: 0.5,
      minSpeechDuration: 250,
      minSilenceDuration: 500,
    });

    const stt = new inference.STT({ model: 'deepgram/nova-3', language: 'en' });
    const llm = openai.LLM.withGroq({
      model: 'llama-3.3-70b-versatile',
      apiKey: process.env.GROQ_API_KEY
    });
    const tts = new inference.TTS({
      model: 'cartesia/sonic-3',
      voice: '9626c31c-bec5-4cca-baa8-f8ba9e84c8bc',
      sampleRate: 24000
    });

    const agent = new voice.Agent({
      instructions: systemPrompt,
      stt,
      vad,
      llm,
      tts,
      turnHandling: {
        turnDetection: undefined,
        endpointing: {
          minEndpointingDelay: 1500,
          minSpeechDuration: 500,
        },
        preemptiveGeneration: {},
        interruption: {
          enabled: true,
          minWords: 5,
          minDuration: 600,
        },
      },
    });

    // Pass components to AgentSession defensively since livekit versions vary in whether they strictly require them here.
    const session = new voice.AgentSession({
      stt,
      vad,
      llm,
      tts,
      connOptions: {
        ttsConnOptions: {
          timeoutMs: 30000
        },
        llmConnOptions: {
          timeoutMs: 30000
        }
      }
    });

    // Finalize logic flag
    let finalized = false;
    const handleFinalize = async () => {
      if (finalized) return;
      finalized = true;
      console.log(`[Agent] Finalizing interview session for room: ${roomName}`);
      const timeoutHandle = setTimeout(() => {
        console.error('[Agent] Finalization timed out after 60 seconds. Forcing exit.');
        process.exit(1);
      }, 60_000);
      try {
        await finalizeInterview(interviewId, session);
      } finally {
        clearTimeout(timeoutHandle);
      }
    };

    globalFinalizeHandler = handleFinalize;

    ctx.room.on('disconnected', () => {
      console.log('[Agent] Room disconnected.');
      setTimeout(() => handleFinalize(), 5000);
    });

    ctx.room.on('trackSubscribed', (track, publication, participant) => {
      console.log(`[Agent] Track subscribed: ${track.sid} (${track.kind}) from participant: ${participant.identity}`);
    });
    ctx.room.on('trackPublished', (publication, participant) => {
      console.log(`[Agent] Track published: ${publication.sid} (${publication.kind}) by participant: ${participant.identity}`);
    });

    session.on('close', () => {
      console.log('[Agent] Agent session closed.');
      globalFinalizeHandler = null;
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
      instructions: `Begin Phase 1. Greet ${candidateName} by name, introduce yourself as their AI technical interviewer for the ${role} position, give a quick one-sentence overview of how the session will run, and ask them to introduce themselves.`,
    });
  },
});

// Run agent runner CLI
cli.runApp(new ServerOptions({
  agent: fileURLToPath(import.meta.url),
  logLevel: process.env.LIVEKIT_LOG_LEVEL || 'info'
}));