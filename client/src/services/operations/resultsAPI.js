import { toast } from 'react-hot-toast';
import { setLoading } from '../../redux/slices/authSlice';
import { setResults } from '../../redux/slices/resultsSlice';
import { apiConnector } from '../apiconnector';
import { endpoints } from '../api';

const { GET_RESULTS_API, GET_EVALUATION_API, GET_TRANSCRIPT_API, DOWNLOAD_REPORT_API } = endpoints;

export function getResults(sessionId) {
    return async (dispatch) => {
        const toastId = `results-loading-${sessionId}`;
        toast.loading('Loading Results...', { id: toastId });
        dispatch(setLoading(true));
        try {
            const response = await apiConnector('GET', `${GET_RESULTS_API}/${sessionId}`);

            console.log('GET RESULTS API RESPONSE............', response);

            if (!response.success) {
                throw new Error(response.message);
            }

            // Transform backend data to match ResultsPage expectation
            const interview = response.data;
            const evaluation = interview.overallEvaluation || {};

            const transformedResults = {
                candidate: {
                    name: interview.user?.name || 'Candidate',
                    role: interview.role,
                    id: interview._id.substring(interview._id.length - 6).toUpperCase() // Short ID
                },
                executiveSummary: {
                    score: Math.round(evaluation.percentage || 0),
                    recommendation: evaluation.recommendation || 'Pending',
                    description: evaluation.feedback || 'Evaluation pending...'
                },
                keyTakeaways: [
                    ...(evaluation.strengths || []).map(s => ({ type: 'strength', text: s })),
                    ...(evaluation.weaknesses || []).map(w => ({ type: 'weakness', text: w }))
                ].slice(0, 4), // Mix of top points
                scoreBreakdown: (evaluation.skillPerformance || []).map(s => ({
                    category: s.skill,
                    score: Math.round((s.averageScore / 10) * 100), // Convert to percentage
                    feedback: s.verified ? 'Verified Skill' : 'Needs Verification'
                })),
                topHighlights: (evaluation.strengths || []).map(s => ({
                    title: 'Strength',
                    description: s
                })),
                growthOpportunities: (evaluation.growthOpportunities || []).map(g => ({
                    title: g.title,
                    description: g.description
                })),
                sessionEvidence: (interview.questions || [])
                    .filter(q => q.answer?.transcript)
                    .map(q => ({
                        question: q.questionText,
                        transcript: q.answer.transcript
                    }))
            };

            dispatch(setResults(transformedResults));
            toast.success('Results Loaded Successfully', { id: toastId });
            return transformedResults;
        } catch (error) {
            console.log('GET RESULTS API ERROR............', error);
            toast.error(error.message || 'Failed to Load Results', { id: toastId });
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function getEvaluation(sessionId, questionId) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await apiConnector(
                'GET',
                `${GET_EVALUATION_API}/${sessionId}/${questionId}`
            );

            console.log('GET EVALUATION API RESPONSE............', response);

            if (!response.success) {
                throw new Error(response.message);
            }

            return response.data;
        } catch (error) {
            console.log('GET EVALUATION API ERROR............', error);
            toast.error(error.message || 'Failed to Get Evaluation');
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function getTranscript(sessionId) {
    return async (dispatch) => {
        const toastId = `transcript-loading-${sessionId}`;
        toast.loading('Loading Transcript...', { id: toastId });
        dispatch(setLoading(true));
        try {
            const response = await apiConnector('GET', `${GET_TRANSCRIPT_API}/${sessionId}`);

            console.log('GET TRANSCRIPT API RESPONSE............', response);

            if (!response.success) {
                throw new Error(response.message);
            }

            toast.success('Transcript Loaded Successfully', { id: toastId });
            return response.data;
        } catch (error) {
            console.log('GET TRANSCRIPT API ERROR............', error);
            toast.error(error.message || 'Failed to Load Transcript', { id: toastId });
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function downloadReport(sessionId) {
    return async (dispatch) => {
        const toastId = `report-downloading-${sessionId}`;
        toast.loading('Downloading Report...', { id: toastId });
        dispatch(setLoading(true));
        try {
            const response = await apiConnector(
                'GET',
                `${DOWNLOAD_REPORT_API}/${sessionId}`,
                null,
                null,
                null,
                'blob'
            );

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Interview_Report_${sessionId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success('Report Downloaded Successfully', { id: toastId });
            return response;
        } catch (error) {
            console.log('DOWNLOAD REPORT API ERROR............', error);
            toast.error(error.message || 'Failed to Download Report', { id: toastId });
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };
}
