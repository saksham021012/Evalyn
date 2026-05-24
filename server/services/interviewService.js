import Interview from '../models/Interview.js';
import Resume from '../models/Resume.js';
import User from '../models/User.js';
import { evaluateAnswer, generateInterviewSummary } from './aiService.js';
import { AccessToken } from 'livekit-server-sdk';
import { config } from '../config/config.js';

export const createInterview = async (userId, resumeId, role, difficulty) => {
    // get resume
    const resume = await Resume.findById(resumeId);

    if (!resume) {
        const error = new Error('Resume not found');
        error.statusCode = 404;
        throw error;
    }

    // Create interview without pre-generated questions (LiveKit agent will generate dynamically)
    const interview = new Interview({
        user: userId,
        resume: resumeId,
        role,
        difficulty,
        status: 'not-started',
        questions: [],
        stats: {
            totalQuestions: 0
        }
    });

    await interview.save();

    return interview;
};

export const getInterviewById = async (id) => {
    const interview = await Interview.findById(id)
        .populate('user', 'name email')
        .populate('resume');

    if (!interview) {
        const error = new Error('Interview not found');
        error.statusCode = 404;
        throw error;
    }

    return interview;
};

export const startInterview = async (id) => {
    const interview = await Interview.findById(id);

    if (!interview) {
        const error = new Error('Interview not found');
        error.statusCode = 404;
        throw error;
    }

    interview.status = 'in-progress';
    interview.startedAt = new Date();

    if (interview.questions.length > 0) {
        interview.questions[0].askedAt = new Date();
    }

    await interview.save();

    return {
        interview,
        currentQuestion: interview.questions.length > 0 ? interview.questions[0] : null
    };
};


export const completeInterview = async (id) => {
    const interview = await Interview.findById(id).populate('resume');

    if (!interview) {
        const error = new Error('Interview not found');
        error.statusCode = 404;
        throw error;
    }

    // Generate overall summary
    let summaryResult = { success: false };
    try {
        summaryResult = await generateInterviewSummary(interview, interview.resume?.parsedData);
    } catch (summaryErr) {
        console.error('Failed to generate summary during manual complete:', summaryErr);
    }

    if (summaryResult.success) {
        interview.overallEvaluation = summaryResult.summary;
    }

    interview.status = 'completed';
    interview.completedAt = new Date();

    await interview.save();

    return interview;
};

export const getUserInterviews = async (userId) => {
    const interviews = await Interview.find({ user: userId })
        .populate('resume', 'fileName parsedData.experienceLevel')
        .sort({ createdAt: -1 })
        .select('-questions.answer.transcript'); // Exclude transcripts for performance

    return interviews;
};

export const deleteInterview = async (userId, id) => {
    const interview = await Interview.findById(id);

    if (!interview) {
        const error = new Error('Interview not found');
        error.statusCode = 404;
        throw error;
    }

    // Check ownership
    if (interview.user.toString() !== userId) {
        const error = new Error('Unauthorized');
        error.statusCode = 401;
        throw error;
    }

    await Interview.findByIdAndDelete(id);

    return true;
};

export const getLiveKitToken = async (userId, id) => {
    const interview = await Interview.findById(id);
    if (!interview) {
        const error = new Error('Interview not found');
        error.statusCode = 404;
        throw error;
    }

    const user = await User.findById(userId);
    const name = user ? user.name : 'Candidate';

    const roomName = `interview_${id}`;

    const apiKey = config.livekit.apiKey;
    const apiSecret = config.livekit.apiSecret;
    const serverUrl = config.livekit.serverUrl;

    // Fallback for demo or development if not configured
    if (!apiKey || !apiSecret || !serverUrl) {
        const error = new Error('LiveKit server credentials are not configured in backend .env');
        error.statusCode = 500;
        throw error;
    }

    // Create Access Token
    const at = new AccessToken(apiKey, apiSecret, {
        identity: userId.toString(),
        name: name,
    });

    at.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true
    });

    const token = await at.toJwt();

    return {
        token,
        roomName,
        serverUrl
    };
};
