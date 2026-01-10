import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume',
        required: true
    },

    // Interview configuration
    role: {
        type: String,
        enum: ['frontend', 'backend', 'fullstack', 'dsa', 'devops', 'mobile', 'data-science', 'hr'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },

    // Interview status
    status: {
        type: String,
        enum: ['not-started', 'in-progress', 'completed', 'abandoned'],
        default: 'not-started'
    },

    // Questions and answers
    questions: [{
        questionNumber: Number,
        questionText: String,
        questionType: {
            type: String,
            enum: ['technical', 'behavioral', 'project-based', 'resume-based']
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard']
        },
        relatedSkills: [String],

        // Answer details
        answer: {
            transcript: String,
            submittedAt: Date
        },

        // Evaluation
        evaluation: {
            score: {
                type: Number,
                min: 0,
                max: 10
            },
            feedback: String,
            strengths: [String],
            weaknesses: [String],
            suggestions: [String],

            // Resume-aware evaluation
            matchesResumeClaim: Boolean,
            resumeClaimVerified: String, // Which skill/experience was verified

            evaluatedAt: Date
        },

        // Question metadata
        askedAt: Date,
        timeSpent: Number, // in seconds
        skipped: {
            type: Boolean,
            default: false
        },
        reRecorded: {
            type: Boolean,
            default: false
        }
    }],

    // Interview statistics
    stats: {
        totalQuestions: {
            type: Number,
            default: 0
        },
        questionsAnswered: {
            type: Number,
            default: 0
        },
        questionsSkipped: {
            type: Number,
            default: 0
        },
        averageScore: {
            type: Number,
            default: 0
        },
        totalTimeSpent: {
            type: Number,
            default: 0
        }
    },

    // Overall evaluation
    overallEvaluation: {
        totalScore: Number,
        percentage: Number,
        grade: {
            type: String
            // Removed strict enum to prevent AI hallucination errors
        },

        // Skill-wise performance
        skillPerformance: [{
            skill: String,
            averageScore: Number,
            questionsAsked: Number,
            claimedInResume: Boolean,
            verified: Boolean
        }],

        // Strengths and weaknesses
        strengths: [String],
        weaknesses: [String],

        // Resume improvement suggestions
        resumeSuggestions: [String],

        // Overall feedback
        feedback: String,

        // Recommendation
        recommendation: {
            type: String
            // Removed strict enum
        }
    },

    // Adaptive questioning metadata
    adaptiveData: {
        currentDifficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard']
        },
        performanceTrend: {
            type: String,
            enum: ['improving', 'declining', 'stable']
        },
        focusAreas: [String] // Skills to focus on based on performance
    },

    // Timestamps
    startedAt: Date,
    completedAt: Date

}, {
    timestamps: true
});

// Indexes
interviewSchema.index({ user: 1, createdAt: -1 });
interviewSchema.index({ status: 1 });
interviewSchema.index({ resume: 1 });

// Calculate overall score before saving
interviewSchema.pre('save', function (next) {
    if (this.questions && this.questions.length > 0) {
        const answeredQuestions = this.questions.filter(q => q.evaluation && q.evaluation.score !== undefined);

        if (answeredQuestions.length > 0) {
            const totalScore = answeredQuestions.reduce((sum, q) => sum + q.evaluation.score, 0);
            this.stats.averageScore = totalScore / answeredQuestions.length;

            if (this.overallEvaluation) {
                this.overallEvaluation.totalScore = totalScore;
                this.overallEvaluation.percentage = (totalScore / (answeredQuestions.length * 10)) * 100;
            }
        }
    }
    next();
});

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
