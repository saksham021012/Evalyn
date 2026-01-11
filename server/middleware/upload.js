import multer from 'multer';
import { config } from '../config/config.js';

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
