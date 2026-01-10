import Interview from '../models/Interview.js';
import PDFDocument from 'pdfkit';

// Get evaluation for a specific question
// GET /api/results/evaluation/:sessionId/:questionNumber
export const getEvaluation = async (req, res) => {
    try {
        const { sessionId, questionNumber } = req.params;

        const interview = await Interview.findById(sessionId);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        const question = interview.questions.find(q => q.questionNumber === parseInt(questionNumber));

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        res.json({
            success: true,
            data: question.evaluation
        });

    } catch (error) {
        console.error('Error in getEvaluation:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get full transcript of the interview
// GET /api/results/transcript/:sessionId
export const getTranscript = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const interview = await Interview.findById(sessionId);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        const transcript = interview.questions.map(q => ({
            questionNumber: q.questionNumber,
            questionText: q.questionText,
            answer: q.answer?.transcript || '',
            evaluation: q.evaluation?.feedback || ''
        }));

        res.json({
            success: true,
            data: transcript
        });

    } catch (error) {
        console.error('Error in getTranscript:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Download interview report as PDF
// GET /api/results/download/:sessionId
export const downloadReport = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const interview = await Interview.findById(sessionId)
            .populate('user', 'name email')
            .populate('resume');

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        const evaluation = interview.overallEvaluation || {};

        // Create a new PDF document with buffering enabled to support footer generation across pages
        const doc = new PDFDocument({
            margin: 50,
            bufferPages: true
        });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Interview_Report_${sessionId}.pdf`);

        // Pipe the PDF directly to the response
        doc.pipe(res);

        // --- Header Section ---
        doc.fontSize(24).fillColor('#1a1a1a').text('Interview Assessment Report', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(10).fillColor('#666666').text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, { align: 'center' });
        doc.moveDown(2);

        // --- Candidate Info Box ---
        doc.rect(50, 120, 500, 80).fill('#f8f9fa');
        doc.fillColor('#1a1a1a');
        doc.fontSize(12).font('Helvetica-Bold').text('Candidate Details', 70, 135);
        doc.font('Helvetica').fontSize(10);
        doc.text(`Name: ${interview.user?.name || 'N/A'}`, 70, 155);
        doc.text(`Email: ${interview.user?.email || 'N/A'}`, 70, 170);
        doc.text(`Role: ${interview.role || 'N/A'}`, 300, 155);
        doc.text(`Difficulty: ${interview.difficulty || 'N/A'}`, 300, 170);

        doc.moveDown(3);

        // --- Score Overview ---
        const score = Math.round(evaluation.percentage || 0);
        doc.fontSize(16).font('Helvetica-Bold').text('Performance Overview', 50);
        doc.moveDown(0.5);

        // Save current Y to align Recommendation column
        const scoreY = doc.y;

        doc.fontSize(36).fillColor(score >= 70 ? '#10b981' : (score >= 40 ? '#f59e0b' : '#ef4444')).text(`${score}%`, 50, scoreY);
        doc.fontSize(12).fillColor('#666666').text('Overall Score', 50);

        doc.fontSize(14).font('Helvetica-Bold').fillColor('#1a1a1a').text('Recommendation', 300, scoreY + 5);
        doc.fontSize(12).font('Helvetica').text(evaluation.recommendation || 'N/A', 300);

        doc.moveDown(3);

        // --- Executive Summary ---
        doc.fontSize(14).font('Helvetica-Bold').text('Executive Summary', 50);
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica').fillColor('#333333').text(evaluation.feedback || 'No summary available.', { align: 'justify', lineHeight: 1.4 });
        doc.moveDown(2);

        // --- Strengths & Weaknesses ---
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#1a1a1a').text('Top Strengths', 50);
        const strengthsHeaderY = doc.y - 14;
        doc.text('Areas for Improvement', 300, strengthsHeaderY);
        doc.moveDown(1);

        const listStartY = doc.y;
        doc.fontSize(10).font('Helvetica').fillColor('#333333');

        // Render Strengths Column
        if (evaluation.strengths && evaluation.strengths.length > 0) {
            evaluation.strengths.forEach((s) => {
                doc.text(`• ${s}`, 50, doc.y, { width: 230 });
                doc.moveDown(0.5);
            });
        } else {
            doc.text('No specific strengths identified.', 50);
        }

        const strengthsEndY = doc.y;

        // Reset to top of list for Weaknesses Column
        doc.y = listStartY;
        if (evaluation.weaknesses && evaluation.weaknesses.length > 0) {
            evaluation.weaknesses.forEach((w) => {
                doc.text(`• ${w}`, 300, doc.y, { width: 230 });
                doc.moveDown(0.5);
            });
        } else {
            doc.text('No major weaknesses identified.', 300);
        }

        // Set Y to the maximum of both columns
        doc.y = Math.max(strengthsEndY, doc.y);
        doc.moveDown(2);

        doc.addPage();

        // --- Detailed Q&A ---
        doc.fontSize(16).font('Helvetica-Bold').text('Detailed Question Analysis', 50, 50);
        doc.moveDown(1);

        interview.questions.forEach((q, index) => {
            if (doc.y > 650) doc.addPage();

            doc.rect(50, doc.y, 500, 25).fill('#f1f5f9');
            doc.fillColor('#1e293b').font('Helvetica-Bold').fontSize(11).text(`Question ${q.questionNumber}: ${q.difficulty}`, 65, doc.y + 7);
            doc.moveDown(0.8);

            doc.fillColor('#334155').font('Helvetica').fontSize(10).text(q.questionText, 65, doc.y, { width: 470 });
            doc.moveDown(0.5);

            doc.font('Helvetica-Bold').fillColor('#64748b').text('Answer Transcript:', 65);
            doc.font('Helvetica').fillColor('#475569').text(q.answer?.transcript || 'No answer provided.', { align: 'justify', width: 470 });
            doc.moveDown(0.5);

            doc.font('Helvetica-Bold').fillColor('#64748b').text('AI Evaluation:', 65);
            doc.font('Helvetica').fillColor('#475569').text(`Score: ${q.evaluation?.score || 0}/10`, { oblique: true });
            doc.text(q.evaluation?.feedback || 'No feedback available.', { align: 'justify', width: 470 });
            doc.moveDown(2);
        });

        // --- Resume Suggestions ---
        if (evaluation.resumeSuggestions && evaluation.resumeSuggestions.length > 0) {
            if (doc.y > 600) doc.addPage();
            doc.fontSize(14).font('Helvetica-Bold').fillColor('#1a1a1a').text('Resume Improvement Suggestions', 50);
            doc.moveDown(0.5);
            evaluation.resumeSuggestions.forEach(s => {
                doc.fontSize(10).font('Helvetica').fillColor('#333333').text(`• ${s}`, { indent: 20 });
            });
        }

        // --- Footer ---
        const pages = doc.bufferedPageRange();
        for (let i = 0; i < pages.count; i++) {
            doc.switchToPage(i);
            doc.fontSize(8).fillColor('#999999').text(
                `Generated by AI Interviewer Platform | Page ${i + 1} of ${pages.count}`,
                50,
                doc.page.height - 50,
                { align: 'center' }
            );
        }

        // Finalize the PDF
        doc.end();

    } catch (error) {
        console.error('Error in downloadReport:', error);
        // If headers already sent, we can't send JSON error
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    }
};
