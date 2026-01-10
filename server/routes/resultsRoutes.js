import express from 'express';
import {
    getEvaluation,
    getTranscript,
    downloadReport
} from '../controllers/resultsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All results routes require authentication
router.use(authenticate);

// Get evaluation for a specific question
router.get('/evaluation/:sessionId/:questionNumber', getEvaluation);

// Get full transcript
router.get('/transcript/:sessionId', getTranscript);

// Download report
router.get('/download/:sessionId', downloadReport);

export default router;
