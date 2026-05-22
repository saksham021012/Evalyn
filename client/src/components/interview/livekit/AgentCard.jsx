import { Cpu } from 'lucide-react';
import { BarVisualizer } from '@livekit/components-react';

function AgentCard({ agentState, isAgentSpeaking, agentAudioTrackRef }) {
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
    );
}

export default AgentCard;
