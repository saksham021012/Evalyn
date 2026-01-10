import express from 'express';
import {
    uploadResumeController,
    getResumeById,
    getUserResumes,
    deleteResume,
    downloadResume,
    setActiveResume
} from '../controllers/resumeController.js';
import { uploadResume, handleMulterError } from '../middleware/upload.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All resume routes require authentication
router.use(authenticate);

// Upload and parse resume
router.post('/upload', uploadResume, handleMulterError, uploadResumeController);

// Get resume by ID
router.get('/:id', getResumeById);

// Get all resumes for a user
router.get('/user/:userId', getUserResumes);

// Download resume file
router.get('/:id/download', downloadResume);

// Delete resume
router.delete('/:id', deleteResume);

// Set active resume
router.put('/:id/active', setActiveResume);

export default router;
