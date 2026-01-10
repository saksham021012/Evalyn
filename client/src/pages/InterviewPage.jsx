import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import InterviewTopBar from '../components/interview/InterviewTopBar';
import QuestionProgress from '../components/interview/QuestionProgress';
import QuestionCard from '../components/interview/QuestionCard';
import VideoRecorder from '../components/interview/VideoRecorder';
import InterviewControls from '../components/interview/InterviewControls';
import LiveTranscript from '../components/interview/LiveTranscript';
import InterviewCompleted from '../components/interview/InterviewCompleted';
import { startInterview, getQuestion, submitAnswer, endInterview, skipQuestion } from '../services';
import useTextToSpeech from '../hooks/useTextToSpeech';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import useSessionTimer from '../hooks/useSessionTimer';

const MAX_SKIPS = 3;
const TOTAL_QUESTIONS = 10;

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
    const { interviewSession, currentQuestion } = useSelector((state) => state.interview);
    const { loading } = useSelector((state) => state.auth);

    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [skipsUsed, setSkipsUsed] = useState(0);
    const [recordedVideoBlob, setRecordedVideoBlob] = useState(null);
    const [useManualInput, setUseManualInput] = useState(false);
    const [manualText, setManualText] = useState('');

    const { isSpeaking, speak, stop: stopSpeaking } = useTextToSpeech();
    const { transcript, transcriptRef, resetTranscript, finalizeTranscript, hasError, errorType } = useSpeechRecognition(
        isRecording,
        recordedVideoBlob
    );
    const sessionTime = useSessionTimer();

    // Auto-switch to manual input when speech recognition fails
    useEffect(() => {
        if (hasError && errorType && !useManualInput) {
            setUseManualInput(true);
            toast.error(
                errorType === 'network'
                    ? 'Speech recognition unavailable. Switched to manual text input.'
                    : 'Speech recognition error. Switched to manual text input.',
                { duration: 5000 }
            );
        }
    }, [hasError, errorType, useManualInput]);

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

    // Load question and speak it
    useEffect(() => {
        const sessionId = getSessionId(interviewSession);
        if (sessionId && !currentQuestion) {
            dispatch(getQuestion(sessionId));
        }
    }, [interviewSession, currentQuestion, dispatch]);

    useEffect(() => {
        if (currentQuestion?.questionText) {
            speak(currentQuestion.questionText);
        }
    }, [currentQuestion, speak]);

    const handleRecordingComplete = useCallback(() => {
        finalizeTranscript();
        setRecordedVideoBlob(true);
    }, [finalizeTranscript]);

    const handleReRecord = useCallback(() => {
        setRecordedVideoBlob(null);
        resetTranscript();
        setManualText('');
        setIsRecording(true);
    }, [resetTranscript]);

    const handleSubmitAnswer = useCallback(async () => {
        if (!interviewSession || !currentQuestion) return;

        const finalTranscript = useManualInput ? manualText : (transcript || transcriptRef.current);
        const sessionId = getSessionId(interviewSession);

        setIsProcessing(true);
        try {
            const result = await dispatch(submitAnswer({
                sessionId,
                questionNumber: currentQuestion.questionNumber,
                transcript: finalTranscript.trim()
            }));

            if (result?.isCompleted) {
                navigate(`/interview/results/${sessionId}`);
            } else {
                setRecordedVideoBlob(null);
                resetTranscript();
                setManualText('');
                dispatch(getQuestion(sessionId));
            }
        } catch (error) {
            console.error('Failed to submit answer:', error);
        } finally {
            setIsProcessing(false);
        }
    }, [interviewSession, currentQuestion, transcript, transcriptRef, useManualInput, manualText, dispatch, navigate, resetTranscript]);

    const handleSkip = useCallback(async () => {
        if (skipsUsed >= MAX_SKIPS || !currentQuestion) return;

        stopSpeaking();
        setSkipsUsed(prev => prev + 1);

        try {
            const sessionId = getSessionId(interviewSession);
            await dispatch(skipQuestion(sessionId, currentQuestion.questionNumber));

            setRecordedVideoBlob(null);
            setIsRecording(false);
            resetTranscript();
            setManualText('');
        } catch (error) {
            console.error('Failed to skip question:', error);
            setSkipsUsed(prev => prev - 1);
        }
    }, [skipsUsed, currentQuestion, stopSpeaking, interviewSession, dispatch, resetTranscript]);

    const handleEndSession = useCallback(async () => {
        stopSpeaking();
        const sessionId = getSessionId(interviewSession);
        if (sessionId) {
            await dispatch(endInterview(sessionId, navigate));
        } else {
            navigate('/dashboard');
        }
    }, [stopSpeaking, interviewSession, dispatch, navigate]);

    const handleToggleRecording = useCallback(() => {
        setIsRecording(prev => !prev);
    }, []);

    const handleToggleInputMode = useCallback((manual) => {
        setUseManualInput(manual);
        if (manual) {
            // Copy transcript to manual text when switching
            setManualText(transcript || transcriptRef.current);
        }
    }, [transcript, transcriptRef]);

    if (!currentQuestion && loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Preparing your interview...</p>
                </div>
            </div>
        );
    }

    if (!currentQuestion && !loading && interviewSession) {
        return <InterviewCompleted onEndSession={handleEndSession} />;
    }

    return (
        <div className="flex min-h-screen bg-black">
            <div className="flex-1 flex flex-col">
                <InterviewTopBar
                    sessionTime={sessionTime}
                    onEndSession={handleEndSession}
                />

                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-6xl mx-auto">
                        <QuestionProgress
                            currentIndex={(currentQuestion?.questionNumber || 1) - 1}
                            total={TOTAL_QUESTIONS}
                        />

                        <QuestionCard
                            question={currentQuestion?.questionText || 'Loading question...'}
                            isSpeaking={isSpeaking}
                            onStopSpeaking={stopSpeaking}
                        />

                        <VideoRecorder
                            isRecording={isRecording}
                            onRecordingComplete={handleRecordingComplete}
                        />

                        <LiveTranscript
                            transcript={transcript}
                            isRecording={isRecording}
                            isProcessing={isProcessing}
                            useManualInput={useManualInput}
                            onManualTextChange={setManualText}
                            manualText={manualText}
                            speechError={hasError ? errorType : null}
                            onToggleInputMode={handleToggleInputMode}
                        />

                        <InterviewControls
                            isRecording={isRecording}
                            onToggleRecording={handleToggleRecording}
                            onReRecord={handleReRecord}
                            onSubmit={handleSubmitAnswer}
                            onSkip={handleSkip}
                            skipsRemaining={MAX_SKIPS - skipsUsed}
                            canSkip={!isProcessing && !isRecording}
                            canSubmit={!!recordedVideoBlob && !isRecording}
                            isProcessing={isProcessing}
                            useManualInput={useManualInput}
                        />
                    </div>
                </div>

                <div className="bg-black border-t border-slate-800 px-8 py-3">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>● SYSTEMS NOMINAL</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InterviewPage;