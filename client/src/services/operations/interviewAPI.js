import { toast } from 'react-hot-toast';
import { setLoading } from '../../redux/slices/authSlice';
import { setInterviewSession, setCurrentQuestion } from '../../redux/slices/interviewSlice';
import { apiConnector } from '../apiconnector';
import { endpoints } from '../api';

const { START_INTERVIEW_API, GET_QUESTION_API, SUBMIT_ANSWER_API, END_INTERVIEW_API, GET_SESSION_API } = endpoints;

export function startInterview(data, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading('Starting Interview...');
        dispatch(setLoading(true));
        try {
            // Updated to match backend /api/interviews/create
            const response = await apiConnector('POST', START_INTERVIEW_API, data);

            console.log('START INTERVIEW API RESPONSE............', response);

            if (!response.success) {
                throw new Error(response.message);
            }

            toast.success('Interview Started Successfully', { id: toastId });
            dispatch(setInterviewSession(response.data));

            if (navigate) {
                const sessionId = response.data?.interview?._id || response.data?._id;
                if (sessionId) {
                    navigate(`/interview?sessionId=${sessionId}`);
                } else {
                    navigate('/interview');
                }
            }

            return response.data;
        } catch (error) {
            console.log('START INTERVIEW API ERROR............', error);
            toast.error(error.message || 'Failed to Start Interview', { id: toastId });
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function getQuestion(sessionId) {
    return async (dispatch) => {
        const toastId = toast.loading('Fetching Next Question...');
        dispatch(setLoading(true));
        try {
            // Updated to match backend /api/interviews/:id/next-question
            // Using endpoints.BASE_URL is hard because endpoints is imported. 
            // We can rely on the fact that GET_QUESTION_API in api.js was pointing to /interviews/question.
            // Better to construct it properly. 
            // Let's assume endpoints.GET_QUESTION_API is just a base or we reconstruct.
            // Actually, let's look at api.js. I set GET_QUESTION_API: `${BASE_URL}/interviews/question`.
            // The backend needs `${BASE_URL}/interviews/${sessionId}/next-question`.
            // So we can ignore GET_QUESTION_API and use a base + ID.

            // To be safe and clean, I will assume we should use the base URL from somewhere or fix api.js to only export base.
            // But apiConnector takes a full URL. Easiest way is to hack the string or import BASE_URL.
            // But I can't import BASE_URL easily if it's not exported.

            // Re-reading api.js, it exports `endpoints`. 
            // I'll update api.js to export INTERVIEW_BASE_API = `${BASE_URL}/interviews` for easier dynamic construction?
            // checking api.js content again...

            // To minimize changes, I will update api.js to have the exact endpoints I need, 
            // OR I will hardcode the path manipulation here if I have access to the base.

            // Let's use string manipulation on one of the endpoints that has the base we want.
            // START_INTERVIEW_API is `${BASE_URL}/interviews/create`.
            const interviewBaseUrl = START_INTERVIEW_API.replace('/create', '');

            const response = await apiConnector('GET', `${interviewBaseUrl}/${sessionId}/next-question`);

            console.log('GET QUESTION API RESPONSE............', response);

            if (!response.success) {
                throw new Error(response.message);
            }

            dispatch(setCurrentQuestion(response.data));
            toast.success('Question Loaded', { id: toastId });
            return response.data;
        } catch (error) {
            console.log('GET QUESTION API ERROR............', error);
            toast.error(error.message || 'Failed to Get Question', { id: toastId });
            throw error; // Propagate error so loop can handle it
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function submitAnswer(data) {
    return async (dispatch) => {
        const toastId = toast.loading('Submitting Answer...');
        dispatch(setLoading(true));
        try {
            const payload = {
                questionNumber: data.questionNumber,
                transcript: data.transcript || ''
            };

            console.log('📤 Sending JSON payload:', payload);

            const interviewBaseUrl = START_INTERVIEW_API.replace('/create', '');
            // Backend: POST /:id/answer
            const response = await apiConnector('POST', `${interviewBaseUrl}/${data.sessionId}/answer`, payload);

            console.log('SUBMIT ANSWER API RESPONSE............', response);

            if (!response.success) {
                throw new Error(response.message);
            }

            toast.success('Answer Submitted Successfully', { id: toastId });
            return response.data;
        } catch (error) {
            console.log('SUBMIT ANSWER API ERROR............', error);
            toast.error(error.message || 'Failed to Submit Answer', { id: toastId });
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function endInterview(sessionId, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading('Computing Results...');
        // dispatch(setLoading(true)); // User requested to avoid full screen loader
        try {
            const interviewBaseUrl = START_INTERVIEW_API.replace('/create', '');
            // Backend: POST /:id/complete
            const response = await apiConnector('POST', `${interviewBaseUrl}/${sessionId}/complete`, {});

            console.log('END INTERVIEW API RESPONSE............', response);

            if (!response.success) {
                throw new Error(response.message);
            }

            toast.success('Interview Completed Successfully', { id: toastId });

            if (navigate) {
                navigate(`/interview/results/${sessionId}`);
            }

            return response.data;
        } catch (error) {
            console.log('END INTERVIEW API ERROR............', error);
            toast.error(error.message || 'Failed to End Interview', { id: toastId });
            throw error;
        } finally {
            // dispatch(setLoading(false));
        }
    };
}

export function skipQuestion(sessionId, questionNumber) {
    return async (dispatch) => {
        const toastId = toast.loading('Skipping Question...');
        dispatch(setLoading(true));
        try {
            const interviewBaseUrl = START_INTERVIEW_API.replace('/create', '');
            // Backend: POST /:id/skip
            const response = await apiConnector('POST', `${interviewBaseUrl}/${sessionId}/skip`, {
                questionNumber
            });

            console.log('SKIP QUESTION API RESPONSE............', response);

            if (!response.success) {
                throw new Error(response.message);
            }

            toast.success('Question Skipped', { id: toastId });

            // Get next question after skipping
            await dispatch(getQuestion(sessionId));

            return response.data;
        } catch (error) {
            console.log('SKIP QUESTION API ERROR............', error);
            toast.error(error.message || 'Failed to Skip Question', { id: toastId });
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function getInterviewSession(sessionId, showToastsAndLoader = true) {
    return async (dispatch) => {
        let toastId = null;
        if (showToastsAndLoader) {
            toastId = toast.loading('Loading Session...');
            dispatch(setLoading(true));
        }
        try {
            const interviewBaseUrl = START_INTERVIEW_API.replace('/create', '');
            // Backend: GET /:id
            const response = await apiConnector('GET', `${interviewBaseUrl}/${sessionId}`);

            console.log('GET SESSION API RESPONSE............', response);

            if (!response.success) {
                throw new Error(response.message);
            }

            dispatch(setInterviewSession(response.data));
            if (showToastsAndLoader && toastId) {
                toast.success('Session Loaded', { id: toastId });
            }
            return response.data;
        } catch (error) {
            console.log('GET SESSION API ERROR............', error);
            if (showToastsAndLoader) {
                toast.error(error.message || 'Failed to Get Session', { id: toastId });
            }
            throw error;
        } finally {
            if (showToastsAndLoader) {
                dispatch(setLoading(false));
            }
        }
    };
}

export function getUserInterviews(userId) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await apiConnector('GET', `${endpoints.GET_USER_INTERVIEWS_API}/${userId}`);

            console.log('GET USER INTERVIEWS API RESPONSE............', response);

            if (!response.success) {
                throw new Error(response.message);
            }

            return response.data;
        } catch (error) {
            console.log('GET USER INTERVIEWS API ERROR............', error);
            toast.error(error.message || 'Failed to Get User Interviews');
            return [];
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function deleteInterview(sessionId) {
    return async (dispatch) => {
        const toastId = toast.loading('Deleting Interview Session...');
        dispatch(setLoading(true));
        try {
            const interviewBaseUrl = START_INTERVIEW_API.replace('/create', '');
            const response = await apiConnector('DELETE', `${interviewBaseUrl}/${sessionId}`);

            console.log('DELETE INTERVIEW API RESPONSE............', response);

            if (!response.success) {
                throw new Error(response.message);
            }

            toast.success('Interview Deleted Successfully', { id: toastId });
            return true;
        } catch (error) {
            console.log('DELETE INTERVIEW API ERROR............', error);
            toast.error(error.message || 'Failed to Delete Interview', { id: toastId });
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function getLiveKitToken(sessionId) {
    return async (dispatch) => {
        try {
            const interviewBaseUrl = START_INTERVIEW_API.replace('/create', '');
            const response = await apiConnector('POST', `${interviewBaseUrl}/${sessionId}/token`, {});
            console.log('GET LIVEKIT TOKEN RESPONSE............', response);
            if (!response.success) {
                throw new Error(response.message);
            }
            return response.data;
        } catch (error) {
            console.log('GET LIVEKIT TOKEN ERROR............', error);
            toast.error(error.message || 'Failed to generate connection token');
            throw error;
        }
    };
}

