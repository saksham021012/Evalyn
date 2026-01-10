import mongoose from 'mongoose';

// Upload video
// POST /api/videos/upload
// (Handled by multer middleware, this just confirms upload)
export const uploadVideoController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No video file uploaded'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Video uploaded successfully',
            data: {
                videoId: req.file.id,
                filename: req.file.filename,
                size: req.file.size
            }
        });

    } catch (error) {
        console.error('Error in uploadVideoController:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Stream video
// GET /api/videos/:id
export const streamVideo = async (req, res) => {
    try {
        const { id } = req.params;

        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'videos'
        });

        const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(id));

        downloadStream.on('error', (error) => {
            res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        });

        res.set('Content-Type', 'video/webm');
        downloadStream.pipe(res);

    } catch (error) {
        console.error('Error in streamVideo:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Delete video
// DELETE /api/videos/:id
export const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;

        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'videos'
        });

        await bucket.delete(new mongoose.Types.ObjectId(id));

        res.json({
            success: true,
            message: 'Video deleted successfully'
        });

    } catch (error) {
        console.error('Error in deleteVideo:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
