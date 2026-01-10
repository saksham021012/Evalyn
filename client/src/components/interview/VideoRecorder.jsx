import { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Settings } from 'lucide-react';

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
            {/* Signal Quality Badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                <div className="flex gap-1">
                    <div className="w-1 h-3 bg-green-500 rounded"></div>
                    <div className="w-1 h-3 bg-green-500 rounded"></div>
                    <div className="w-1 h-3 bg-green-500 rounded"></div>
                </div>
                <span className="text-green-400 text-xs font-medium">{signalQuality} SIGNAL</span>
                <span className="text-gray-400 text-xs">60fps</span>
            </div>

            {/* Recording Timer */}
            {isRecording && (
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-red-500/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-bold">{formatTime(recordingTime)}</span>
                    <span className="text-white/80 text-xs">ELAPSED</span>
                </div>
            )}

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

            {/* Audio Visualizer */}
            {isMicOn && isRecording && (
                <div className="absolute bottom-20 left-4 right-4 flex items-center justify-center gap-1 h-12 bg-black/40 backdrop-blur-sm rounded-lg px-4">
                    <div className="w-1 bg-blue-500 rounded-full animate-pulse" style={{ height: '20%' }}></div>
                    <div className="w-1 bg-blue-500 rounded-full animate-pulse" style={{ height: '40%', animationDelay: '0.1s' }}></div>
                    <div className="w-1 bg-blue-500 rounded-full animate-pulse" style={{ height: '60%', animationDelay: '0.2s' }}></div>
                    <div className="w-1 bg-blue-500 rounded-full animate-pulse" style={{ height: '80%', animationDelay: '0.3s' }}></div>
                    <div className="w-1 bg-blue-500 rounded-full animate-pulse" style={{ height: '60%', animationDelay: '0.4s' }}></div>
                    <div className="w-1 bg-blue-500 rounded-full animate-pulse" style={{ height: '40%', animationDelay: '0.5s' }}></div>
                    <div className="w-1 bg-blue-500 rounded-full animate-pulse" style={{ height: '20%', animationDelay: '0.6s' }}></div>
                </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6">
                <button
                    onClick={toggleCamera}
                    className="p-2 transition hover:scale-110 active:scale-95"
                >
                    {isCameraOn ? (
                        <Video className="w-6 h-6 text-white drop-shadow-lg" />
                    ) : (
                        <VideoOff className="w-6 h-6 text-red-500 drop-shadow-lg" />
                    )}
                </button>

                <button
                    onClick={toggleMic}
                    className="p-2 transition hover:scale-110 active:scale-95"
                >
                    {isMicOn ? (
                        <Mic className="w-6 h-6 text-white drop-shadow-lg" />
                    ) : (
                        <MicOff className="w-6 h-6 text-red-500 drop-shadow-lg" />
                    )}
                </button>
            </div>

            {/* Max Time Indicator */}
            <div className="absolute top-4 right-20 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                <span className="text-gray-400 text-xs">05:00</span>
                <span className="text-gray-600 text-xs ml-1">LEFT</span>
            </div>
        </div>
    );
}

export default VideoRecorder;
