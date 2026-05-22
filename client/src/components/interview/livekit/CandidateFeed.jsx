import { VideoTrack } from '@livekit/components-react';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';

function CandidateFeed({
    isCameraEnabled,
    localCamTrackRef,
    isMicrophoneEnabled,
    toggleMic,
    toggleCamera,
    onEndSession
}) {
    return (
        <div className="relative bg-[#f5f4f0] border border-[#e7e5e0] rounded-2xl overflow-hidden shadow-sm aspect-video flex flex-col justify-end">
            {/* Video track */}
            {isCameraEnabled && localCamTrackRef ? (
                <VideoTrack 
                    trackRef={localCamTrackRef} 
                    className="w-full h-full object-cover absolute inset-0"
                />
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#faf9f6] text-[#a8a29e]">
                    <VideoOff className="w-12 h-12 mb-3 text-[#d4d0c9]" />
                    <p className="font-mono text-[10px] tracking-widest font-semibold uppercase">Camera is disabled</p>
                </div>
            )}

            {/* Top Stats HUD overlay */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-[#e7e5e0] shadow-sm">
                    <span className="flex h-1.5 w-1.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2b4c3f] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#2b4c3f]"></span>
                    </span>
                    <span className="text-[#1c1917] text-[9px] font-bold font-mono tracking-[0.2em] uppercase">Candidate Feed</span>
                </div>
            </div>

            {/* Bottom Media Controls Bar overlay */}
            <div className="relative z-10 p-4 bg-gradient-to-t from-white/90 via-white/40 to-transparent flex items-center justify-between">
                <div className="font-medium">
                    {isMicrophoneEnabled ? (
                        <span className="flex items-center gap-1.5 text-[#2b4c3f] font-mono text-[9px] font-bold uppercase tracking-[0.2em]">
                            <span className="w-1.5 h-1.5 bg-[#2b4c3f] rounded-full animate-pulse"></span>
                            Audio Live
                        </span>
                    ) : (
                        <span className="text-red-500 font-mono text-[9px] font-bold uppercase tracking-[0.2em]">Audio Muted</span>
                    )}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2.5">
                    <button
                        onClick={toggleMic}
                        className={`p-2.5 rounded-xl border transition-all shadow-sm ${
                            isMicrophoneEnabled 
                            ? 'bg-white border-[#e7e5e0] hover:bg-[#f5f4f0] text-[#1c1917]' 
                            : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                        }`}
                        title={isMicrophoneEnabled ? "Mute Microphone" : "Unmute Microphone"}
                    >
                        {isMicrophoneEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </button>

                    <button
                        onClick={toggleCamera}
                        className={`p-2.5 rounded-xl border transition-all shadow-sm ${
                            isCameraEnabled 
                            ? 'bg-white border-[#e7e5e0] hover:bg-[#f5f4f0] text-[#1c1917]' 
                            : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                        }`}
                        title={isCameraEnabled ? "Turn Camera Off" : "Turn Camera On"}
                    >
                        {isCameraEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </button>

                    <button
                        onClick={onEndSession}
                        className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition shadow-sm font-mono text-[10px] tracking-[0.2em] font-bold uppercase flex items-center gap-2"
                        title="End Interview & Finalize Report"
                    >
                        <PhoneOff className="w-3.5 h-3.5" />
                        End Interview
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CandidateFeed;
