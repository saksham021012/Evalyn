import { Video, VideoOff, Mic, MicOff } from 'lucide-react';

function RecorderControls({ isCameraOn, toggleCamera, isMicOn, toggleMic }) {
    return (
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
    );
}

export default RecorderControls;
