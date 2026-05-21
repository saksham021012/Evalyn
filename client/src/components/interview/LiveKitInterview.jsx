import { useState, useEffect, useRef } from 'react';
import {
    useRoomContext,
    useParticipants,
    useLocalParticipant,
    useTracks,
    VideoTrack,
    RoomAudioRenderer,
    BarVisualizer
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { Mic, MicOff, Video, VideoOff, PhoneOff, User, Cpu, AlertCircle, Volume2 } from 'lucide-react';

function LiveKitInterview({ sessionId, onEndSession }) {
    const room = useRoomContext();
    const participants = useParticipants();
    const { localParticipant, isMicrophoneEnabled, isCameraEnabled } = useLocalParticipant();
    
    // Find the remote agent participant
    const agentParticipant = participants.find(p => !p.isLocal);
    
    // Agent states: 'idle' | 'listening' | 'thinking' | 'speaking'
    const agentState = agentParticipant?.attributes?.['lk.agent.state'] || 'idle';
    const isAgentSpeaking = agentParticipant?.isSpeaking || false;
    
    // Get Agent's audio track reference for the BarVisualizer
    const microphoneTracks = useTracks([Track.Source.Microphone]);
    const agentAudioTrackRef = microphoneTracks.find(ref => ref?.participant && !ref.participant.isLocal);
    
    // Get Local candidate's camera track reference
    const cameraTracks = useTracks([Track.Source.Camera]);
    const localCamTrackRef = cameraTracks.find(ref => ref?.participant && ref.participant.isLocal);

    // Live transcript state
    const [messages, setMessages] = useState([]);
    const transcriptEndRef = useRef(null);

    // Auto-scroll transcripts
    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Capture real-time transcriptions using LiveKit text stream handler
    useEffect(() => {
        if (!room) return;

        const handleTextStream = async (reader, participantInfo) => {
            try {
                const isTranscription = reader.info.attributes['lk.transcribed_track_id'] !== undefined;
                if (!isTranscription) return;

                const identity = participantInfo?.identity;
                const isLocal = identity && room.localParticipant && identity === room.localParticipant.identity;
                const speakerName = isLocal ? 'You' : 'Interviewer';
                
                // readAll resolves when the stream is complete for this segment
                const text = await reader.readAll();
                if (text && text.trim()) {
                    setMessages(prev => {
                        // Avoid exact duplicate consecutive messages
                        if (prev.length > 0 && prev[prev.length - 1].text === text.trim() && prev[prev.length - 1].sender === speakerName) {
                            return prev;
                        }
                        return [...prev, {
                            id: Math.random().toString(),
                            sender: speakerName,
                            text: text.trim(),
                            timestamp: new Date()
                        }];
                    });
                }
            } catch (err) {
                console.error('[LiveKitInterview] Error reading transcription stream:', err);
            }
        };

        room.registerTextStreamHandler('lk.transcription', handleTextStream);

        // Send a greeting reminder text to log just in case
        setMessages([
            {
                id: 'welcome',
                sender: 'System',
                text: 'Connected to AI Interviewer. Start speaking when you are ready.',
                timestamp: new Date()
            }
        ]);

        return () => {
            try {
                room.unregisterTextStreamHandler('lk.transcription');
            } catch (err) {
                console.error('[LiveKitInterview] Error unregistering text stream handler:', err);
            }
        };
    }, [room]);

    const toggleMic = async () => {
        if (!localParticipant) return;
        try {
            await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
        } catch (err) {
            console.error('Failed to toggle microphone:', err);
        }
    };

    const toggleCamera = async () => {
        if (!localParticipant) return;
        try {
            await localParticipant.setCameraEnabled(!isCameraEnabled);
        } catch (err) {
            console.error('Failed to toggle camera:', err);
        }
    };

    // Determine Agent UI Styles and Status
    let ringColorClass = 'ring-slate-800 shadow-[0_0_15px_rgba(30,41,59,0.2)]';
    let statusText = 'Ready';
    let statusBadgeColor = 'bg-slate-700 text-slate-300';
    let ringPulseClass = '';

    if (agentState === 'speaking' || isAgentSpeaking) {
        ringColorClass = 'ring-purple-500 shadow-[0_0_35px_rgba(168,85,247,0.6)] border-purple-400';
        statusText = 'AI is speaking';
        statusBadgeColor = 'bg-purple-900/60 text-purple-300 border border-purple-700/50';
        ringPulseClass = 'animate-pulse';
    } else if (agentState === 'thinking') {
        ringColorClass = 'ring-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.5)] border-amber-400';
        statusText = 'AI is thinking...';
        statusBadgeColor = 'bg-amber-950/60 text-amber-300 border border-amber-700/50';
        ringPulseClass = 'animate-pulse';
    } else if (agentState === 'listening') {
        ringColorClass = 'ring-emerald-500 shadow-[0_0_35px_rgba(16,185,129,0.5)] border-emerald-400';
        statusText = 'Listening to you...';
        statusBadgeColor = 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/50';
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-6xl mx-auto items-stretch">
            {/* RoomAudioRenderer mounts the audio element automatically for voice playback */}
            <RoomAudioRenderer />

            {/* Left Column: Stacked Agent and Candidate Video Feed (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Agent Card */}
                <div className="relative bg-slate-900/80 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] backdrop-blur-sm shadow-xl overflow-hidden">
                    {/* Glowing Grid Background Effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 z-10">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${statusBadgeColor} transition-all duration-300`}>
                            <span className="w-1.5 h-1.5 bg-current rounded-full animate-ping"></span>
                            {statusText}
                        </span>
                    </div>

                    {/* Agent Avatar with glowing pulsing rings */}
                    <div className="relative z-10 mb-6 mt-4">
                        {/* Glowing ring underlay */}
                        {(agentState === 'speaking' || isAgentSpeaking || agentState === 'thinking') && (
                            <div className={`absolute -inset-4 rounded-full blur-xl opacity-40 transition-all duration-500 bg-gradient-to-r ${
                                agentState === 'thinking' ? 'from-amber-500 to-yellow-300' : 'from-purple-600 to-indigo-500'
                            } ${ringPulseClass}`}></div>
                        )}
                        
                        {/* Outer rotating ring for thinking */}
                        {agentState === 'thinking' && (
                            <div className="absolute -inset-2 rounded-full border-2 border-dashed border-amber-400/60 animate-spin" style={{ animationDuration: '6s' }}></div>
                        )}

                        {/* Main Avatar Container */}
                        <div className={`relative w-32 h-32 rounded-full bg-slate-950 flex items-center justify-center border-2 border-slate-700 ring-4 transition-all duration-300 ${ringColorClass}`}>
                            {agentState === 'speaking' || isAgentSpeaking ? (
                                <Cpu className="w-16 h-16 text-purple-400 animate-pulse" />
                            ) : agentState === 'thinking' ? (
                                <Cpu className="w-16 h-16 text-amber-400" />
                            ) : (
                                <Cpu className="w-16 h-16 text-slate-500" />
                            )}
                        </div>
                    </div>

                    {/* Agent name */}
                    <h3 className="relative z-10 text-lg font-bold text-white tracking-wide">AI TECHNICAL INTERVIEWER</h3>
                    <p className="relative z-10 text-xs text-slate-500 mt-1 uppercase tracking-widest font-mono">Livekit Agent Worker v1.0</p>

                    {/* Bar Visualizer */}
                    {agentAudioTrackRef && (
                        <div className="relative z-10 mt-6 w-full max-w-xs flex justify-center h-8">
                            <BarVisualizer 
                                trackRef={agentAudioTrackRef} 
                                state={agentState} 
                                barCount={15} 
                                className="flex gap-1 items-end w-full h-full"
                            />
                        </div>
                    )}
                </div>

                {/* Candidate Feed Card */}
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
            </div>

            {/* Right Column: Live Transcription panel (5 cols) */}
            <div className="lg:col-span-5 flex flex-col bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm" style={{ maxHeight: '640px' }}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-bold text-slate-300 tracking-wider uppercase font-mono">Live Subtitles</span>
                    </div>
                </div>

                {/* Subtitle Dialogue Items — scrollable, does NOT push viewport */}
                <div className="flex-1 p-6 overflow-y-auto overscroll-contain flex flex-col gap-4 min-h-0">
                    {messages.map((msg) => {
                        const isSystem = msg.sender === 'System';
                        const isAgent = msg.sender === 'Interviewer';
                        return (
                            <div 
                                key={msg.id}
                                className={`flex flex-col max-w-[85%] ${
                                    isSystem ? 'mx-auto text-center' : isAgent ? 'mr-auto items-start' : 'ml-auto items-end'
                                }`}
                            >
                                <span className={`text-[10px] uppercase font-mono tracking-wider mb-1 ${
                                    isSystem ? 'text-blue-500' : isAgent ? 'text-purple-400' : 'text-emerald-400'
                                }`}>
                                    {msg.sender}
                                </span>
                                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                    isSystem 
                                    ? 'bg-blue-950/20 border border-blue-900/30 text-blue-300/80 rounded-xl' 
                                    : isAgent 
                                    ? 'bg-purple-950/40 border border-purple-900/30 text-purple-200 rounded-tl-none' 
                                    : 'bg-emerald-950/40 border border-emerald-900/30 text-emerald-200 rounded-tr-none'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={transcriptEndRef} />
                </div>

                {/* Instructions Box */}
                <div className="p-4 bg-slate-950/50 border-t border-slate-800/80 text-[11px] text-slate-500 flex gap-2 items-start font-mono leading-normal shrink-0">
                    <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                        <span>Speech is automatically transcribed. Tap the red button to finish the session whenever you are ready.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LiveKitInterview;
