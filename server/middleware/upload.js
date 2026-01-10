import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import { config } from '../config/config.js';
import path from 'path';

// GridFS storage for video files
export const createVideoStorage = () => {
    return new GridFsStorage({
        url: config.mongodbUri,
        options: { useNewUrlParser: true, useUnifiedTopology: true },
        file: (req, file) => {
            return {
                filename: `video_${Date.now()}${path.extname(file.originalname)}`,
                bucketName: 'videos' // Collection name in MongoDB
            };
        }
    });
};

// GridFS storage for resume files
export const createResumeStorage = () => {
    return new GridFsStorage({
        url: config.mongodbUri,
        options: { useNewUrlParser: true, useUnifiedTopology: true },
        file: (req, file) => {
            return {
                filename: `resume_${Date.now()}${path.extname(file.originalname)}`,
                bucketName: 'resumes' // Collection name in MongoDB
            };
        }
    });
};

// File filter for resumes (PDF and DOCX only)
const resumeFileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'), false);
    }
};

// File filter for videos
const videoFileFilter = (req, file, cb) => {
    const allowedTypes = [
        'video/mp4',
        'video/webm',
        'video/ogg'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only MP4, WebM, and OGG videos are allowed.'), false);
    }
};

// Memory storage for resume processing (we'll read the file and then store in GridFS manually)
const memoryStorage = multer.memoryStorage();

// Resume upload middleware (using memory storage for processing)
export const uploadResume = multer({
    storage: memoryStorage,
    limits: {
        fileSize: config.maxFileSize
    },
    fileFilter: resumeFileFilter
}).single('resume');

// Video upload middleware (using memory storage temporarily to avoid GridFS issues)
export const uploadVideo = multer({
    storage: memoryStorage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB for videos
    },
    fileFilter: videoFileFilter
}).single('video');

// Error handling middleware for multer
export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large'
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message
        });
    } else if (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next();
};
