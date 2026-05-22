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
        <div className="relative bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl aspect-video flex flex-col justify-end">
            {/* Video track */}
            {isCameraEnabled && localCamTrackRef ? (
                <VideoTrack 
                    trackRef={localCamTrackRef} 
                    className="w-full h-full object-cover absolute inset-0"
                />
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 text-slate-500">
                    <VideoOff className="w-16 h-16 mb-2 text-slate-700" />
                    <p className="text-sm font-medium">Camera is disabled</p>
                </div>
            )}

            {/* Top Stats HUD overlay */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-800/80">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span className="text-slate-300 text-[10px] font-mono tracking-wider">CANDIDATE FEED</span>
                </div>
            </div>

            {/* Bottom Media Controls Bar overlay */}
            <div className="relative z-10 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between">
                <div className="text-xs text-slate-400 font-medium">
                    {isMicrophoneEnabled ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            AUDIO LIVE
                        </span>
                    ) : (
                        <span className="text-red-400 font-mono text-[10px]">AUDIO MUTED</span>
                    )}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleMic}
                        className={`p-2.5 rounded-xl border transition duration-300 ${
                            isMicrophoneEnabled 
                            ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-white' 
                            : 'bg-red-950/60 border-red-800 text-red-400 hover:bg-red-900/60'
                        }`}
                        title={isMicrophoneEnabled ? "Mute Microphone" : "Unmute Microphone"}
                    >
                        {isMicrophoneEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </button>

                    <button
                        onClick={toggleCamera}
                        className={`p-2.5 rounded-xl border transition duration-300 ${
                            isCameraEnabled 
                            ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-white' 
                            : 'bg-red-950/60 border-red-800 text-red-400 hover:bg-red-900/60'
                        }`}
                        title={isCameraEnabled ? "Turn Camera Off" : "Turn Camera On"}
                    >
                        {isCameraEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </button>

                    <button
                        onClick={onEndSession}
                        className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white border border-red-500/30 rounded-xl transition duration-300 font-semibold text-xs tracking-wider flex items-center gap-1.5"
                        title="End Interview & Finalize Report"
                    >
                        <PhoneOff className="w-3.5 h-3.5" />
                        END INTERVIEW
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CandidateFeed;
