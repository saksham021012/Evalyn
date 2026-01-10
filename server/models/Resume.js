import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        enum: ['pdf', 'docx'],
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    // GridFS file ID for the original resume
    fileId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    // Target role for interview
    targetRole: {
        type: String,
        required: true
    },
    // Parsed resume data
    parsedData: {
        // Personal information
        name: String,
        email: String,
        phone: String,
        location: String,

        // Professional summary
        summary: String,

        // Skills extracted from resume
        skills: [{
            name: String,
            category: {
                type: String,
                enum: ['frontend', 'backend', 'database', 'devops', 'tools', 'soft-skills', 'other']
            },
            proficiency: {
                type: String,
                enum: ['beginner', 'intermediate', 'advanced', 'expert']
            }
        }],

        // Work experience
        experience: [{
            company: String,
            position: String,
            duration: String,
            startDate: String,
            endDate: String,
            description: String,
            technologies: [String]
        }],

        // Projects
        projects: [{
            name: String,
            description: String,
            technologies: [String],
            role: String,
            duration: String,
            link: String
        }],

        // Education
        education: [{
            institution: String,
            degree: String,
            field: String,
            graduationYear: String,
            gpa: String
        }],

        // Certifications
        certifications: [{
            name: String,
            issuer: String,
            date: String,
            credentialId: String
        }],

        // Tech stack summary
        techStack: {
            languages: [String],
            frameworks: [String],
            databases: [String],
            tools: [String]
        },

        // Experience level (calculated)
        experienceLevel: {
            type: String,
            enum: ['fresher', 'junior', 'mid-level', 'senior', 'expert'],
            default: 'fresher'
        },

        // Total years of experience
        totalYearsOfExperience: {
            type: Number,
            default: 0
        }
    },

    // Raw text extracted from resume
    rawText: {
        type: String,
        required: true
    },

    // Parsing status
    parsingStatus: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },

    parsingError: String,

    // Active status (only one can be active at a time)
    isActive: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

// Indexes for faster queries
resumeSchema.index({ user: 1, createdAt: -1 });
resumeSchema.index({ user: 1, isActive: 1 }); // Efficiently find active resume
resumeSchema.index({ 'parsedData.skills.name': 1 });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
