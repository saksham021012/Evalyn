import express from 'express';
import {
    createInterview,
    getInterviewById,
    startInterview,
    getNextQuestion,
    submitAnswer,
    skipQuestion,
    completeInterview,
    getUserInterviews,
    deleteInterview
} from '../controllers/interviewController.js';
import { authenticate } from '../middleware/auth.js';


const router = express.Router();

// All interview routes require authentication
router.use(authenticate);

// Create new interview
router.post('/create', createInterview);

// Get interview by ID
router.get('/:id', getInterviewById);

// Delete interview
router.delete('/:id', deleteInterview);

// Start interview
router.post('/:id/start', startInterview);

// Get next question
router.get('/:id/next-question', getNextQuestion);

// Submit answer
router.post('/:id/answer', submitAnswer);

// Skip question
router.post('/:id/skip', skipQuestion);

// Complete interview
router.post('/:id/complete', completeInterview);

// Get user's interview history
router.get('/user/:userId', getUserInterviews);

export default router;
