import * as interviewService from '../services/interviewService.js';

// Create new interview session
// POST /api/interviews/create
export const createInterview = async (req, res) => {
    try {
        const { resumeId, role, difficulty } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Missing userId field'
            });
        }
        if (!resumeId) {
            return res.status(400).json({
                success: false,
                message: 'Missing resumeId field'
            });
        }
        if (!role) {
            return res.status(400).json({
                success: false,
                message: 'Missing role field'
            });
        }
        if (!difficulty) {
            return res.status(400).json({
                success: false,
                message: 'Missing difficulty field'
            });
        }

        const data = await interviewService.createInterview(userId, resumeId, role, difficulty);

        res.status(201).json({
            success: true,
            message: 'Interview created successfully',
            data
        });

    } catch (error) {
        console.error('Error in createInterview:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server error',
            error: error.message
        });
    }
};

// Get interview by ID
// GET /api/interviews/:id
export const getInterviewById = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await interviewService.getInterviewById(id);

        res.json({
            success: true,
            data
        });

    } catch (error) {
        console.error('Error in getInterviewById:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server error',
            error: error.message
        });
    }
};

// Start interview
// POST /api/interviews/:id/start
export const startInterview = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await interviewService.startInterview(id);

        res.json({
            success: true,
            message: 'Interview started',
            data
        });

    } catch (error) {
        console.error('Error in startInterview:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server error',
            error: error.message
        });
    }
};


// Complete interview
// POST /api/interviews/:id/complete
export const completeInterview = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await interviewService.completeInterview(id);

        res.json({
            success: true,
            message: 'Interview completed',
            data
        });

    } catch (error) {
        console.error('Error in completeInterview:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server error',
            error: error.message
        });
    }
};

// Get user's interview history
// GET /api/interviews/user/:userId
export const getUserInterviews = async (req, res) => {
    try {
        const { userId } = req.params;

        const data = await interviewService.getUserInterviews(userId);

        res.json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {
        console.error('Error in getUserInterviews:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server error',
            error: error.message
        });
    }
};

// Delete interview and related data
// DELETE /api/interviews/:id
export const deleteInterview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        await interviewService.deleteInterview(userId, id);

        res.json({
            success: true,
            message: 'Interview and associated data deleted successfully'
        });

    } catch (error) {
        console.error('Error in deleteInterview:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server error',
            error: error.message
        });
    }
};

// Get LiveKit token for room connection
// POST /api/interviews/:id/token
export const getLiveKitToken = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Missing userId'
            });
        }

        const data = await interviewService.getLiveKitToken(userId, id);

        res.json({
            success: true,
            data
        });

    } catch (error) {
        console.error('Error in getLiveKitToken:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server error',
            error: error.message
        });
    }
};
