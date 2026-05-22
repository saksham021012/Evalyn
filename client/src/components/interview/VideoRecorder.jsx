import { useState, useRef, useEffect } from 'react';
import { VideoOff } from 'lucide-react';
import RecorderHUD from './recorder/RecorderHUD';
import AudioVisualizer from './recorder/AudioVisualizer';
import RecorderControls from './recorder/RecorderControls';

function VideoRecorder({ isRecording, onRecordingComplete }) {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [recordingTime, setRecordingTime] = useState(0);
    const [signalQuality, setSignalQuality] = useState('EXCELLENT');

    // Initialize camera and microphone
    useEffect(() => {
        const initMedia = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        facingMode: 'user'
                    },
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        sampleRate: 44100
                    }
                });

                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (error) {
                console.error('Error accessing media devices:', error);
                alert('Please allow camera and microphone access to continue');
            }
        };

        initMedia();

        // Cleanup: Stop all tracks when component unmounts
        return () => {
            // Get current stream from state
            setStream(currentStream => {
                if (currentStream) {
                    currentStream.getTracks().forEach(track => {
                        track.stop();
                        console.log('Camera/Mic track stopped:', track.kind);
                    });
                }
                return null;
            });
        };
    }, []);

    // Handle "recording" state for UI only
    useEffect(() => {
        if (isRecording) {
            setRecordingTime(0);
        } else {
            // When recording stops, notify parent to finalize transcription
            if (onRecordingComplete) {
                onRecordingComplete();
            }
        }
    }, [isRecording]);

    const toggleCamera = async () => {
        if (!stream) return;

        const videoTrack = stream.getVideoTracks()[0];

        if (isCameraOn) {
            // Stop the video track (turns off camera light)
            videoTrack.stop();
            setIsCameraOn(false);
        } else {
            // Restart camera
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        facingMode: 'user'
                    }
                });

                const newVideoTrack = newStream.getVideoTracks()[0];

                // Replace the old video track with new one
                const audioTrack = stream.getAudioTracks()[0];
                const combinedStream = new MediaStream([newVideoTrack, audioTrack]);

                setStream(combinedStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = combinedStream;
                }

                setIsCameraOn(true);
            } catch (error) {
                console.error('Error restarting camera:', error);
                alert('Could not restart camera');
            }
        }
    };

    const toggleMic = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsMicOn(audioTrack.enabled);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="relative bg-slate-900 rounded-xl overflow-hidden border-2 border-blue-500">
            <RecorderHUD 
                signalQuality={signalQuality}
                isRecording={isRecording}
                recordingTime={recordingTime}
                formatTime={formatTime}
            />

            {/* Video Feed */}
            <div className="relative aspect-video bg-black">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                />

                {!isCameraOn && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                        <div className="text-center">
                            <VideoOff className="w-16 h-16 text-gray-600 mx-auto mb-2" />
                            <p className="text-gray-400">Camera is off</p>
                        </div>
                    </div>
                )}
            </div>

            <AudioVisualizer 
                isMicOn={isMicOn}
                isRecording={isRecording}
            />

            <RecorderControls 
                isCameraOn={isCameraOn}
                toggleCamera={toggleCamera}
                isMicOn={isMicOn}
                toggleMic={toggleMic}
            />
        </div>
    );
}

export default VideoRecorder;
