import express from 'express';
import {
    signup,
    verifyOTP,
    resendOTP,
    login,
    getCurrentUser,
    logout,
    sendResetOTP,
    resetPassword
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.post('/forgot-password', sendResetOTP);
router.post('/reset-password', resetPassword);

// Protected routes (require authentication)
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);

export default router;
