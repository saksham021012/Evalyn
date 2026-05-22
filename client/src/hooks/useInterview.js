import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { startInterview, getLiveKitToken, getInterviewSession, endInterview } from '../services';
import { setResumeData } from '../redux/slices/resumeSlice';
import useSessionTimer from './useSessionTimer';

const getSessionId = (interviewSession) => {
    return interviewSession?.interview?._id || interviewSession?.sessionId || interviewSession?._id;
};

const getResumeDetails = (resumeData) => {
    return {
        userId: resumeData.resume?.user || resumeData.userId,
        resumeId: resumeData.resume?._id || resumeData._id,
        role: resumeData.resume?.targetRole || resumeData.targetRole || 'Software Engineer',
        difficulty: resumeData.difficulty || 'medium'
    };
};

export default function useInterview() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { resumeData } = useSelector((state) => state.resume);
    const { interviewSession } = useSelector((state) => state.interview);
    const { loading } = useSelector((state) => state.auth);

    const [tokenData, setTokenData] = useState(null);
    const [isFetchingToken, setIsFetchingToken] = useState(false);
    const [tokenError, setTokenError] = useState(null);
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [evaluationProgress, setEvaluationProgress] = useState(0);
    const [isSessionLoading, setIsSessionLoading] = useState(false);

    const sessionTime = useSessionTimer();
    const pollingIntervalRef = useRef(null);

    const searchParams = new URLSearchParams(location.search);
    const querySessionId = searchParams.get('sessionId');
    const sessionIdToLoad = querySessionId || location.state?.sessionId;

    // Initialize session
    useEffect(() => {
        const initSession = async () => {
            const currentSessionId = getSessionId(interviewSession);
            const needsFetch = sessionIdToLoad 
                ? (!interviewSession || currentSessionId !== sessionIdToLoad)
                : !interviewSession;

            if (needsFetch) {
                setIsSessionLoading(true);
            }

            try {
                if (sessionIdToLoad) {
                    if (!interviewSession || currentSessionId !== sessionIdToLoad) {
                        const session = await dispatch(getInterviewSession(sessionIdToLoad));
                        if (session) {
                            if (session.status === 'completed') {
                                navigate(`/interview/results/${sessionIdToLoad}`, { replace: true });
                                return;
                            }
                            if (session.resume) {
                                dispatch(setResumeData({ resume: session.resume }));
                            }
                        } else {
                            navigate('/new-session');
                        }
                    } else if (interviewSession) {
                        if (interviewSession.status === 'completed') {
                            navigate(`/interview/results/${sessionIdToLoad}`, { replace: true });
                            return;
                        }
                        if (!resumeData && interviewSession.resume) {
                            dispatch(setResumeData({ resume: interviewSession.resume }));
                        }
                    }
                } else {
                    if (interviewSession) {
                        if (interviewSession.status === 'completed') {
                            const sessionId = getSessionId(interviewSession);
                            navigate(`/interview/results/${sessionId}`, { replace: true });
                            return;
                        }
                        if (!resumeData && interviewSession.resume) {
                            dispatch(setResumeData({ resume: interviewSession.resume }));
                        }
                    } else {
                        if (!resumeData) {
                            navigate('/new-session');
                            return;
                        }
                        await dispatch(startInterview(getResumeDetails(resumeData)));
                    }
                }
            } catch (error) {
                console.error('Failed to initialize session:', error);
                navigate('/new-session');
            } finally {
                setIsSessionLoading(false);
            }
        };
        initSession();
    }, [sessionIdToLoad, resumeData, navigate, dispatch, interviewSession]);

    // Fetch LiveKit connection token once session is ready
    useEffect(() => {
        const fetchToken = async () => {
            const sessionId = getSessionId(interviewSession);
            // Don't fetch token if session is already completed or not loaded yet
            if (interviewSession?.status === 'completed') {
                return;
            }
            if (sessionId && !tokenData && !isFetchingToken && !tokenError) {
                setIsFetchingToken(true);
                setTokenError(null);
                try {
                    const data = await dispatch(getLiveKitToken(sessionId));
                    if (data && data.token) {
                        setTokenData(data);
                    } else {
                        throw new Error("Invalid token data received from server");
                    }
                } catch (err) {
                    console.error('Failed to get LiveKit token:', err);
                    setTokenError(err.message || 'Failed to fetch connection token from server');
                    toast.error(err.message || 'Connection token generation failed');
                } finally {
                    setIsFetchingToken(false);
                }
            }
        };
        fetchToken();
    }, [interviewSession, tokenData, isFetchingToken, tokenError, dispatch]);

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, []);

    // Handle end session and start polling for complete evaluations
    const handleEndSession = useCallback(() => {
        const sessionId = getSessionId(interviewSession);
        if (!sessionId) {
            navigate('/dashboard');
            return;
        }

        setIsFinalizing(true);
        toast.success('Interview ended. Analyzing transcript...');

        // Start progressive loading feedback bar
        const progressTimer = setInterval(() => {
            setEvaluationProgress(prev => {
                if (prev >= 95) {
                    clearInterval(progressTimer);
                    return 95;
                }
                return prev + 5;
            });
        }, 1200);

        let pollAttempts = 0;
        const maxPollAttempts = 8; // 24 seconds total (8 attempts * 3s)

        // Start polling the DB for complete status
        pollingIntervalRef.current = setInterval(async () => {
            pollAttempts++;
            let isCompleted = false;

            try {
                const updatedSession = await dispatch(getInterviewSession(sessionId, false));
                if (updatedSession && updatedSession.status === 'completed') {
                    isCompleted = true;
                }
            } catch (err) {
                console.error('Error polling interview session:', err);
            }

            if (isCompleted) {
                clearInterval(pollingIntervalRef.current);
                clearInterval(progressTimer);
                setEvaluationProgress(100);
                toast.success('Analysis ready! Viewing dashboard report.');
                setTimeout(() => {
                    navigate(`/interview/results/${sessionId}`);
                }, 500);
                return;
            }

            // Fallback: If agent didn't complete within max attempts, force complete
            if (pollAttempts >= maxPollAttempts) {
                clearInterval(pollingIntervalRef.current);
                clearInterval(progressTimer);
                console.log('[useInterview] Polling timed out. Forcing interview completion...');
                toast.loading('Finalizing report...', { id: 'force-complete-toast' });
                try {
                    await dispatch(endInterview(sessionId));
                    setEvaluationProgress(100);
                    toast.success('Report generated!', { id: 'force-complete-toast' });
                    setTimeout(() => {
                        navigate(`/interview/results/${sessionId}`);
                    }, 500);
                } catch (forceErr) {
                    console.error('Failed to force complete interview:', forceErr);
                    toast.error('Failed to analyze session. Returning to dashboard.', { id: 'force-complete-toast' });
                    navigate('/dashboard');
                }
            }
        }, 3000);
    }, [interviewSession, dispatch, navigate]);

    // Handle when LiveKit disconnects (e.g. server closes connection, or user disconnects)
    const handleDisconnected = useCallback(() => {
        console.log('[LiveKitRoom] Disconnected from room.');
        handleEndSession();
    }, [handleEndSession]);

    return {
        tokenData,
        isFetchingToken,
        tokenError,
        isFinalizing,
        evaluationProgress,
        sessionTime,
        handleEndSession,
        handleDisconnected,
        setTokenError,
        interviewSession,
        loading,
        isSessionLoading,
        sessionId: getSessionId(interviewSession)
    };
}
