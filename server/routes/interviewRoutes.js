import express from 'express';
import {
    createInterview,
    getInterviewById,
    startInterview,
    completeInterview,
    getUserInterviews,
    deleteInterview,
    getLiveKitToken
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

// Get LiveKit token
router.post('/:id/token', getLiveKitToken);

// Start interview
router.post('/:id/start', startInterview);


// Complete interview
router.post('/:id/complete', completeInterview);

// Get user's interview history
router.get('/user/:userId', getUserInterviews);

export default router;
