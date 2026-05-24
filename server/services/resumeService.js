import Resume from '../models/Resume.js';
import mongoose from 'mongoose';
import { parseResume } from '../utils/resumeParser.js';

export const uploadAndParseResume = async (userId, file, targetRole) => {
    const fileType = file.mimetype === 'application/pdf' ? 'pdf' : 'docx';

    // Parse the resume
    const parseResult = await parseResume(file.buffer, fileType);

    if (!parseResult.success) {
        const error = new Error(`Failed to parse resume: ${parseResult.error}`);
        error.statusCode = 500;
        throw error;
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
        targetRole: targetRole || 'Software Engineer', // Add default or ensure it's passed
        parsingStatus: 'completed'
    });

    await resume.save();

    return resume;
};

export const getResumeById = async (id) => {
    const resume = await Resume.findById(id).populate('user', 'name email');

    if (!resume) {
        const error = new Error('Resume not found');
        error.statusCode = 404;
        throw error;
    }

    return resume;
};

export const getUserResumes = async (userId) => {
    const resumes = await Resume.find({ user: userId })
        .sort({ createdAt: -1 })
        .select('-rawText'); // Exclude raw text for performance

    return resumes;
};

export const deleteResume = async (id) => {
    const resume = await Resume.findById(id);

    if (!resume) {
        const error = new Error('Resume not found');
        error.statusCode = 404;
        throw error;
    }

    // Delete file from GridFS
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'resumes'
    });

    await bucket.delete(resume.fileId);

    // Delete resume document
    await Resume.findByIdAndDelete(id);

    return true;
};

export const setActiveResume = async (userId, id) => {
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
        const error = new Error('Resume not found');
        error.statusCode = 404;
        throw error;
    }

    return updatedResume;
};

export const getResumeDownloadStream = async (id) => {
    const resume = await Resume.findById(id);

    if (!resume) {
        const error = new Error('Resume not found');
        error.statusCode = 404;
        throw error;
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'resumes'
    });

    const downloadStream = bucket.openDownloadStream(resume.fileId);

    // Sanitize filename and set content type
    const safeFileName = resume.fileName.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
    
    const contentType = resume.fileType === 'pdf' 
        ? 'application/pdf' 
        : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    return {
        downloadStream,
        safeFileName,
        contentType
    };
};
