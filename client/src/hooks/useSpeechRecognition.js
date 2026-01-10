import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for speech recognition functionality
 * @param {boolean} isRecording - Whether recording is active
 * @param {boolean} hasRecordedVideo - Whether a video has been recorded
 * @returns {Object} { transcript, transcriptRef, resetTranscript, finalizeTranscript, hasError, errorType }
 */
const useSpeechRecognition = (isRecording, hasRecordedVideo) => {
    const [transcript, setTranscript] = useState('');
    const [recognition, setRecognition] = useState(null);
    const [hasError, setHasError] = useState(false);
    const [errorType, setErrorType] = useState(null);
    const transcriptRef = useRef('');

    // Setup speech recognition
    useEffect(() => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            console.warn('Speech recognition not supported');
            setHasError(true);
            setErrorType('not-supported');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcriptPiece = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcriptPiece + ' ';
                }
            }

            if (finalTranscript) {
                setTranscript(prev => {
                    const newTranscript = prev + finalTranscript;
                    transcriptRef.current = newTranscript;
                    return newTranscript;
                });
                // Clear error if we successfully get results
                setHasError(false);
                setErrorType(null);
            }
        };

        recognitionInstance.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setHasError(true);
            setErrorType(event.error);
        };

        setRecognition(recognitionInstance);
    }, []);

    // Control recognition based on recording state
    useEffect(() => {
        if (!recognition) return;

        if (isRecording) {
            try {
                if (!hasRecordedVideo) {
                    setTranscript('');
                    transcriptRef.current = '';
                }
                if (recognition.state !== 'running') {
                    recognition.start();
                }
            } catch (error) {
                // Ignore already started errors
            }
        } else {
            try {
                recognition.stop();
            } catch (error) {
                // Ignore errors
            }
        }
    }, [isRecording, recognition, hasRecordedVideo]);

    const resetTranscript = useCallback(() => {
        setTranscript('');
        transcriptRef.current = '';
    }, []);

    const finalizeTranscript = useCallback(() => {
        const finalValue = transcriptRef.current;
        setTranscript(finalValue);
        return finalValue;
    }, []);

    return { transcript, transcriptRef, resetTranscript, finalizeTranscript, hasError, errorType };
};

export default useSpeechRecognition;
