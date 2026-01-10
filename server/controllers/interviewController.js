import Interview from '../models/Interview.js';
import Resume from '../models/Resume.js';
import mongoose from 'mongoose';
import { generateInterviewQuestions, evaluateAnswer, generateInterviewSummary, determineNextDifficulty } from './aiController.js';

// Create new interview session
// POST /api/interviews/create
export const createInterview = async (req, res) => {
    try {
        const { resumeId, role, difficulty } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Missing userId field'
            });
        }
        if (!resumeId) {
            return res.status(400).json({
                success: false,
                message: 'Missing resumeId field'
            });
        }
        if (!role) {
            return res.status(400).json({
                success: false,
                message: 'Missing role field'
            });
        }
        if (!difficulty) {
            return res.status(400).json({
                success: false,
                message: 'Missing difficulty field'
            });
        }

        // Get resume using Mongoose
        const resume = await Resume.findById(resumeId);

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        // Generate questions
        const questionsResult = await generateInterviewQuestions(resume, role, difficulty, 10);

        if (!questionsResult.success) {
            return res.status(500).json({
                success: false,
                message: 'Failed to generate questions',
                error: questionsResult.error
            });
        }

        // Create interview using Mongoose model
        const interview = new Interview({
            user: userId,
            resume: resumeId,
            role,
            difficulty,
            status: 'not-started',
            questions: questionsResult.questions.map((q, index) => ({
                questionNumber: index + 1,
                questionText: q.questionText,
                questionType: q.questionType,
                difficulty: q.difficulty,
                relatedSkills: q.relatedSkills
            })),
            stats: {
                totalQuestions: questionsResult.questions.length
            },
            adaptiveData: {
                currentDifficulty: difficulty,
                performanceTrend: 'stable',
                focusAreas: []
            }
        });

        await interview.save();

        res.status(201).json({
            success: true,
            message: 'Interview created successfully',
            data: interview
        });

    } catch (error) {
        console.error('Error in createInterview:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get interview by ID
// GET /api/interviews/:id
export const getInterviewById = async (req, res) => {
    try {
        const { id } = req.params;

        const interview = await Interview.findById(id)
            .populate('user', 'name email')
            .populate('resume');

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        res.json({
            success: true,
            data: interview
        });

    } catch (error) {
        console.error('Error in getInterviewById:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Start interview
// POST /api/interviews/:id/start
export const startInterview = async (req, res) => {
    try {
        const { id } = req.params;

        const interview = await Interview.findById(id);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        interview.status = 'in-progress';
        interview.startedAt = new Date();

        if (interview.questions.length > 0) {
            interview.questions[0].askedAt = new Date();
        }

        await interview.save();

        res.json({
            success: true,
            message: 'Interview started',
            data: {
                interview,
                currentQuestion: interview.questions[0]
            }
        });

    } catch (error) {
        console.error('Error in startInterview:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get next question
// GET /api/interviews/:id/next-question
export const getNextQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const interview = await Interview.findById(id);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        // Find the first unanswered question (ignore skipped and submitted)
        const nextQuestion = interview.questions.find(q => !q.answer?.submittedAt && !q.skipped);

        if (!nextQuestion) {
            return res.json({
                success: true,
                message: 'No more questions',
                data: null
            });
        }

        // Mark question as asked if not already
        if (!nextQuestion.askedAt) {
            nextQuestion.askedAt = new Date();
            await interview.save();
        }

        res.json({
            success: true,
            data: nextQuestion
        });

    } catch (error) {
        console.error('Error in getNextQuestion:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Submit answer
// POST /api/interviews/:id/answer
export const submitAnswer = async (req, res) => {
    try {
        const { id } = req.params;

        // DEBUG: Log everything we receive
        console.log('=== SUBMIT ANSWER DEBUG ===');
        console.log('Session ID:', id);
        console.log('req.body:', req.body);

        const { questionNumber, transcript } = req.body;

        const interview = await Interview.findById(id).populate('resume');

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        // DEBUG: Log interview questions
        console.log('Interview questions count:', interview.questions.length);
        console.log('Question numbers:', interview.questions.map(q => q.questionNumber));
        console.log('Received questionNumber (raw):', questionNumber, 'type:', typeof questionNumber);

        // Convert questionNumber to integer (FormData sends as string)
        const questionNum = parseInt(questionNumber, 10);
        console.log('Converted questionNum:', questionNum, 'type:', typeof questionNum);

        const question = interview.questions.find(q => {
            console.log('Comparing:', q.questionNumber, 'with', questionNum, 'equal?', q.questionNumber === questionNum);
            return q.questionNumber === questionNum;
        });

        if (!question) {
            console.log('QUESTION NOT FOUND!');
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        console.log('Found question:', question.questionNumber);
        console.log('=== END DEBUG ===');

        console.log('📝 Transcript received:', transcript);
        console.log('📝 Transcript type:', typeof transcript);
        console.log('📝 Transcript length:', transcript?.length);

        // Save answer
        question.answer = {
            transcript: transcript || '',
            submittedAt: new Date()
        };

        console.log('💾 Saved answer:', question.answer);

        // Calculate time spent
        if (question.askedAt) {
            question.timeSpent = Math.floor((new Date() - question.askedAt) / 1000);
        }

        // Evaluate answer using AI
        console.log('🤖 Calling evaluateAnswer with transcript:', transcript);
        const evaluationResult = await evaluateAnswer(question, transcript, interview.resume.parsedData);

        if (evaluationResult.success) {
            question.evaluation = {
                ...evaluationResult.evaluation,
                evaluatedAt: new Date()
            };
        }

        // Update stats
        interview.stats.questionsAnswered += 1;
        interview.stats.totalTimeSpent += question.timeSpent || 0;

        // Adaptive difficulty adjustment
        const recentScores = interview.questions
            .filter(q => q.evaluation && q.evaluation.score !== undefined)
            .slice(-3)
            .map(q => q.evaluation.score);

        if (recentScores.length >= 2) {
            const newDifficulty = determineNextDifficulty(recentScores, interview.adaptiveData.currentDifficulty);
            interview.adaptiveData.currentDifficulty = newDifficulty;
        }

        await interview.save();

        res.json({
            success: true,
            message: 'Answer submitted and evaluated',
            data: {
                evaluation: question.evaluation,
                nextDifficulty: interview.adaptiveData.currentDifficulty
            }
        });

    } catch (error) {
        console.error('Error in submitAnswer:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Skip question
// POST /api/interviews/:id/skip
export const skipQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { questionNumber } = req.body;

        const interview = await Interview.findById(id);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        // Check skip limit (increased to 3)
        if (interview.stats.questionsSkipped >= 3) {
            return res.status(400).json({
                success: false,
                message: 'Skip limit reached'
            });
        }

        // Convert questionNumber to integer (FormData sends as string)
        const questionNum = parseInt(questionNumber, 10);

        const question = interview.questions.find(q => q.questionNumber === questionNum);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        question.skipped = true;
        interview.stats.questionsSkipped += 1;

        await interview.save();

        res.json({
            success: true,
            message: 'Question skipped'
        });

    } catch (error) {
        console.error('Error in skipQuestion:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Complete interview
// POST /api/interviews/:id/complete
export const completeInterview = async (req, res) => {
    try {
        const { id } = req.params;

        const interview = await Interview.findById(id).populate('resume');

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        // Generate overall summary
        const summaryResult = await generateInterviewSummary(interview, interview.resume.parsedData);

        if (summaryResult.success) {
            interview.overallEvaluation = summaryResult.summary;
        }

        interview.status = 'completed';
        interview.completedAt = new Date();

        await interview.save();

        res.json({
            success: true,
            message: 'Interview completed',
            data: interview
        });

    } catch (error) {
        console.error('Error in completeInterview:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get user's interview history
// GET /api/interviews/user/:userId
export const getUserInterviews = async (req, res) => {
    try {
        const { userId } = req.params;

        const interviews = await Interview.find({ user: userId })
            .populate('resume', 'fileName parsedData.experienceLevel')
            .sort({ createdAt: -1 })
            .select('-questions.answer.transcript'); // Exclude transcripts for performance

        res.json({
            success: true,
            count: interviews.length,
            data: interviews
        });

    } catch (error) {
        console.error('Error in getUserInterviews:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Delete interview and related data
// DELETE /api/interviews/:id
export const deleteInterview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const interview = await Interview.findById(id);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        // Check ownership
        if (interview.user.toString() !== userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        await Interview.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Interview and associated data deleted successfully'
        });

    } catch (error) {
        console.error('Error in deleteInterview:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
