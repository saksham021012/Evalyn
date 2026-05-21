import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { LiveKitRoom } from '@livekit/components-react';
import { Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';

import InterviewTopBar from '../components/interview/InterviewTopBar';
import LiveKitInterview from '../components/interview/LiveKitInterview';
import { startInterview, getLiveKitToken, getInterviewSession } from '../services';
import useSessionTimer from '../hooks/useSessionTimer';

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

function InterviewPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { resumeData } = useSelector((state) => state.resume);
    const { interviewSession } = useSelector((state) => state.interview);
    const { loading } = useSelector((state) => state.auth);

    const [tokenData, setTokenData] = useState(null);
    const [isFetchingToken, setIsFetchingToken] = useState(false);
    const [tokenError, setTokenError] = useState(null);
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [evaluationProgress, setEvaluationProgress] = useState(0);

    const sessionTime = useSessionTimer();
    const pollingIntervalRef = useRef(null);

    // Initialize session
    useEffect(() => {
        const initSession = async () => {
            if (!resumeData) {
                navigate('/new-session');
                return;
            }
            if (!interviewSession) {
                await dispatch(startInterview(getResumeDetails(resumeData)));
            }
        };
        initSession();
    }, [resumeData, navigate, dispatch, interviewSession]);

    // Fetch LiveKit connection token once session is ready
    useEffect(() => {
        const fetchToken = async () => {
            const sessionId = getSessionId(interviewSession);
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

        // Start polling the DB for complete status
        pollingIntervalRef.current = setInterval(async () => {
            try {
                const updatedSession = await dispatch(getInterviewSession(sessionId));
                if (updatedSession && updatedSession.status === 'completed') {
                    clearInterval(pollingIntervalRef.current);
                    clearInterval(progressTimer);
                    setEvaluationProgress(100);
                    toast.success('Analysis ready! Viewing dashboard report.');
                    setTimeout(() => {
                        navigate(`/interview/results/${sessionId}`);
                    }, 500);
                }
            } catch (err) {
                console.error('Error polling interview session:', err);
            }
        }, 3000);
    }, [interviewSession, dispatch, navigate]);

    // Handle when LiveKit disconnects (e.g. server closes connection, or user disconnects)
    const handleDisconnected = useCallback(() => {
        console.log('[LiveKitRoom] Disconnected from room.');
        handleEndSession();
    }, [handleEndSession]);

    // Loading screen for preparing session
    if (!interviewSession && loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white font-inter">
                <div className="text-center">
                    <Loader2 className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">Preparing your interview session...</p>
                </div>
            </div>
        );
    }

    // Loader for LiveKit token fetching
    if (isFetchingToken || (!tokenData && !tokenError)) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white font-inter">
                <div className="text-center max-w-sm px-6">
                    <Loader2 className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-300 font-semibold mb-2">Connecting to LiveKit Room...</p>
                    <p className="text-gray-500 text-xs leading-relaxed">
                        Initializing audio pipelines and waking up the AI interviewer. Please wait.
                    </p>
                </div>
            </div>
        );
    }

    // Error handler for LiveKit configuration issues
    if (tokenError) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white font-inter">
                <div className="max-w-md w-full mx-auto px-6 py-8 bg-slate-900/50 border border-red-500/20 rounded-2xl text-center backdrop-blur-sm shadow-xl">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Connection Failed</h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        {tokenError}. Make sure your backend `.env` variables (LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET) are fully configured and correct.
                    </p>
                    <button
                        onClick={() => setTokenError(null)}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    // Finalizing / Polling screen
    if (isFinalizing) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-8 font-inter">
                <div className="max-w-md w-full text-center bg-slate-900/50 border border-slate-800 rounded-2xl p-10 backdrop-blur-sm shadow-2xl shadow-blue-900/10">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/20 shadow-lg shadow-blue-500/5 animate-pulse">
                        <ShieldCheck className="w-10 h-10 text-blue-500 animate-pulse" />
                    </div>
                    <h1 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent tracking-tight">
                        Analyzing Performance
                    </h1>
                    <p className="text-gray-400 text-xs leading-relaxed mb-6">
                        The interviewer has completed. Our AI model is cleaning up the audio transcripts, extracting questions asked, and scoring your performance feedback.
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-950 rounded-full h-1.5 mb-2 overflow-hidden border border-slate-800">
                        <div 
                            className="bg-gradient-to-r from-blue-500 to-emerald-400 h-1.5 rounded-full transition-all duration-700" 
                            style={{ width: `${evaluationProgress}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                        <span>Progress</span>
                        <span>{evaluationProgress}%</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-black select-none">
            <div className="flex-1 flex flex-col">
                <InterviewTopBar
                    sessionTime={sessionTime}
                    onEndSession={handleEndSession}
                />

                <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                    {tokenData && (
                        <LiveKitRoom
                            token={tokenData.token}
                            serverUrl={tokenData.serverUrl}
                            connect={true}
                            audio={true}
                            video={true}
                            onDisconnected={handleDisconnected}
                            className="w-full"
                        >
                            <LiveKitInterview 
                                sessionId={getSessionId(interviewSession)} 
                                onEndSession={handleEndSession} 
                            />
                        </LiveKitRoom>
                    )}
                </div>

                <div className="bg-black border-t border-slate-800 px-8 py-3 shrink-0">
                    <div className="flex items-center justify-between text-[10px] text-slate-600 font-mono tracking-widest uppercase">
                        <span>● LIVEKIT SYSTEM SECURED</span>
                        <span>TURN DETECTION SILERO VAD ACTIVE</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InterviewPage;