import Resume from '../models/Resume.js';
import mongoose from 'mongoose';
import { parseResume } from '../utils/resumeParser.js';

// Upload and parse resume
// POST /api/resumes/upload
export const uploadResumeController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // userId is attached by authenticatye middleware
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication failed'
            });
        }

        const file = req.file;
        const fileType = file.mimetype === 'application/pdf' ? 'pdf' : 'docx';

        // Parse the resume
        const parseResult = await parseResume(file.buffer, fileType);

        if (!parseResult.success) {
            return res.status(500).json({
                success: false,
                message: 'Failed to parse resume',
                error: parseResult.error
            });
        }

        // Store file in GridFS using Mongoose
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'resumes'
        });

        const uploadStream = bucket.openUploadStream(file.originalname, {
            contentType: file.mimetype,
            metadata: {
                userId,
                uploadDate: new Date()
            }
        });

        uploadStream.end(file.buffer);

        await new Promise((resolve, reject) => {
            uploadStream.on('finish', resolve);
            uploadStream.on('error', reject);
        });

        // Create resume document using Mongoose model
        const resume = new Resume({
            user: userId,
            fileName: file.originalname,
            fileType,
            fileSize: file.size,
            fileId: uploadStream.id,
            parsedData: parseResult.parsedData,
            rawText: parseResult.rawText,
            targetRole: req.body.targetRole || 'Software Engineer', // Add default or ensure it's passed
            parsingStatus: 'completed'
        });

        await resume.save();

        res.status(201).json({
            success: true,
            message: 'Resume uploaded and parsed successfully',
            data: {
                resume
            }
        });

    } catch (error) {
        console.error('Error in uploadResumeController:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get resume by ID
// GET /api/resumes/:id
export const getResumeById = async (req, res) => {
    try {
        const { id } = req.params;

        const resume = await Resume.findById(id).populate('user', 'name email');

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        res.json({
            success: true,
            data: resume
        });

    } catch (error) {
        console.error('Error in getResumeById:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get all resumes for a user
// GET /api/resumes/user/:userId
export const getUserResumes = async (req, res) => {
    try {
        const { userId } = req.params;

        const resumes = await Resume.find({ user: userId })
            .sort({ createdAt: -1 })
            .select('-rawText'); // Exclude raw text for performance

        res.json({
            success: true,
            count: resumes.length,
            data: resumes
        });

    } catch (error) {
        console.error('Error in getUserResumes:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Delete resume
// DELETE /api/resumes/:id
export const deleteResume = async (req, res) => {
    try {
        const { id } = req.params;

        const resume = await Resume.findById(id);

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        // Delete file from GridFS
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'resumes'
        });

        await bucket.delete(resume.fileId);

        // Delete resume document
        await Resume.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Resume deleted successfully'
        });

    } catch (error) {
        console.error('Error in deleteResume:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Set active resume
// PUT /api/resumes/:id/active
export const setActiveResume = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        // 1. Deactivate all other resumes for this user
        await Resume.updateMany(
            { user: userId, _id: { $ne: id } },
            { $set: { isActive: false } }
        );

        // 2. Set the requested resume as active
        const updatedResume = await Resume.findOneAndUpdate(
            { _id: id, user: userId },
            { $set: { isActive: true } },
            { new: true }
        );

        if (!updatedResume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        res.json({
            success: true,
            message: 'Resume set as active',
            data: updatedResume
        });

    } catch (error) {
        console.error('Error in setActiveResume:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Download resume file
// GET /api/resumes/:id/download
export const downloadResume = async (req, res) => {
    try {
        const { id } = req.params;

        const resume = await Resume.findById(id);

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'resumes'
        });

        const downloadStream = bucket.openDownloadStream(resume.fileId);

        // Sanitize filename and set content type
        const safeFileName = resume.fileName.replace(/[^a-z0-9.]/gi, '_').toLowerCase();

        res.set({
            'Content-Type': resume.fileType === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': `attachment; filename="${safeFileName}"`
        });

        downloadStream.on('error', (err) => {
            console.error('Download stream error:', err);
            if (!res.headersSent) {
                res.status(500).json({ success: false, message: 'Stream error' });
            }
        });

        downloadStream.pipe(res);

    } catch (error) {
        console.error('Error in downloadResume:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
