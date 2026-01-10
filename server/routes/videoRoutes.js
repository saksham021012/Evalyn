import express from 'express';
import {
    uploadVideoController,
    streamVideo,
    deleteVideo
} from '../controllers/videoController.js';
import { uploadVideo, handleMulterError } from '../middleware/upload.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All video routes require authentication
router.use(authenticate);

// Upload video
router.post('/upload', uploadVideo, handleMulterError, uploadVideoController);

// Stream video
router.get('/:id', streamVideo);

// Delete video
router.delete('/:id', deleteVideo);

export default router;
