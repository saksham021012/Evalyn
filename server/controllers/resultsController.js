import * as resultsService from '../services/resultsService.js';

// Get evaluation for a specific question
// GET /api/results/evaluation/:sessionId/:questionNumber
export const getEvaluation = async (req, res) => {
    try {
        const { sessionId, questionNumber } = req.params;

        const data = await resultsService.getEvaluation(sessionId, questionNumber);

        res.json({
            success: true,
            data
        });

    } catch (error) {
        console.error('Error in getEvaluation:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server error',
            error: error.message
        });
    }
};

// Get full transcript of the interview
// GET /api/results/transcript/:sessionId
export const getTranscript = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const data = await resultsService.getTranscript(sessionId);

        res.json({
            success: true,
            data
        });

    } catch (error) {
        console.error('Error in getTranscript:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server error',
            error: error.message
        });
    }
};

// Download interview report as PDF
// GET /api/results/download/:sessionId
export const downloadReport = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const interview = await resultsService.getReportData(sessionId);

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Interview_Report_${sessionId}.pdf`);

        // Build the PDF and pipe it to res
        resultsService.buildReportPdf(interview, res);

    } catch (error) {
        console.error('Error in downloadReport:', error);
        // If headers already sent, we can't send JSON error
        if (!res.headersSent) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Server error',
                error: error.message
            });
        }
    }
};
