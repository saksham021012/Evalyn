import * as resumeService from '../services/resumeService.js';

// Upload and parse resume
// POST /api/resumes/upload
export const uploadResumeController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication failed'
            });
        }

        const resume = await resumeService.uploadAndParseResume(userId, req.file, req.body.targetRole);

        res.status(201).json({
            success: true,
            message: 'Resume uploaded and parsed successfully',
            data: {
                resume
            }
        });

    } catch (error) {
        console.error('Error in uploadResumeController:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server error',
            error: error.message
        });
    }
};

// Get resume by ID
// GET /api/resumes/:id
export const getResumeById = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await resumeService.getResumeById(id);

        res.json({
            success: true,
            data
        });

    } catch (error) {
        console.error('Error in getResumeById:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server error',
            error: error.message
        });
    }
};

// Get all resumes for a user
// GET /api/resumes/user/:userId
export const getUserResumes = async (req, res) => {
    try {
        const { userId } = req.params;

        const data = await resumeService.getUserResumes(userId);

        res.json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {
        console.error('Error in getUserResumes:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server error',
            error: error.message
        });
    }
};

// Delete resume
// DELETE /api/resumes/:id
export const deleteResume = async (req, res) => {
    try {
        const { id } = req.params;

        await resumeService.deleteResume(id);

        res.json({
            success: true,
            message: 'Resume deleted successfully'
        });

    } catch (error) {
        console.error('Error in deleteResume:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server error',
            error: error.message
        });
    }
};

// Set active resume
// PUT /api/resumes/:id/active
export const setActiveResume = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const data = await resumeService.setActiveResume(userId, id);

        res.json({
            success: true,
            message: 'Resume set as active',
            data
        });

    } catch (error) {
        console.error('Error in setActiveResume:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server error',
            error: error.message
        });
    }
};

// Download resume file
// GET /api/resumes/:id/download
export const downloadResume = async (req, res) => {
    try {
        const { id } = req.params;

        const { downloadStream, safeFileName, contentType } = await resumeService.getResumeDownloadStream(id);

        res.set({
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${safeFileName}"`
        });

        downloadStream.on('error', (err) => {
            console.error('Download stream error:', err);
            if (!res.headersSent) {
                res.status(500).json({ success: false, message: 'Stream error' });
            }
        });

        downloadStream.pipe(res);

    } catch (error) {
        console.error('Error in downloadResume:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server error',
            error: error.message
        });
    }
};
