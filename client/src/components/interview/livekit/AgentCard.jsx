import { Cpu } from 'lucide-react';
import { BarVisualizer } from '@livekit/components-react';

function AgentCard({ agentState, isAgentSpeaking, agentAudioTrackRef }) {
    // Determine Agent UI Styles and Status
    let ringColorClass = 'ring-[#e7e5e0] shadow-sm';
    let statusText = 'Ready';
    let statusBadgeColor = 'bg-[#f5f4f0] text-[#57534e] border border-[#e7e5e0]';

    if (agentState === 'speaking' || isAgentSpeaking) {
        ringColorClass = 'ring-[#2b4c3f]/20 border-[#2b4c3f] shadow-md';
        statusText = 'AI is speaking';
        statusBadgeColor = 'bg-[#2b4c3f]/10 text-[#2b4c3f] border border-[#2b4c3f]/20';
    } else if (agentState === 'thinking') {
        ringColorClass = 'ring-[#d4d0c9] border-[#a8a29e] shadow-sm';
        statusText = 'AI is thinking...';
        statusBadgeColor = 'bg-white text-[#1c1917] border border-[#d4d0c9]';
    } else if (agentState === 'listening') {
        ringColorClass = 'ring-[#e7e5e0] border-[#2b4c3f]/50 shadow-sm';
        statusText = 'Listening to you...';
        statusBadgeColor = 'bg-[#2b4c3f]/5 text-[#2b4c3f] border border-[#2b4c3f]/10';
    }

    return (
        <div className="relative bg-white border border-[#e7e5e0] rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] shadow-sm overflow-hidden">
            {/* Status Badge */}
            <div className="absolute top-4 left-4 z-10">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${statusBadgeColor}`}>
                    <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></span>
                    {statusText}
                </span>
            </div>

            {/* Agent Avatar with minimal rings */}
            <div className="relative z-10 mb-6 mt-4">
                {/* Outer rotating ring for thinking */}
                {agentState === 'thinking' && (
                    <div className="absolute -inset-3 rounded-full border-2 border-dashed border-[#a8a29e] animate-spin" style={{ animationDuration: '6s' }}></div>
                )}

                {/* Main Avatar Container */}
                <div className={`relative w-28 h-28 rounded-full bg-[#faf9f6] flex items-center justify-center border-2 border-[#e7e5e0] ring-4 transition-all duration-500 ${ringColorClass}`}>
                    {agentState === 'speaking' || isAgentSpeaking ? (
                        <Cpu className="w-12 h-12 text-[#2b4c3f] animate-pulse" />
                    ) : agentState === 'thinking' ? (
                        <Cpu className="w-12 h-12 text-[#57534e]" />
                    ) : (
                        <Cpu className="w-12 h-12 text-[#a8a29e]" />
                    )}
                </div>
            </div>

            {/* Agent name */}
            <h3 className="relative z-10 text-lg font-bold font-serif text-[#1c1917] tracking-tight">AI TECHNICAL INTERVIEWER</h3>
            <p className="relative z-10 text-[10px] text-[#a8a29e] mt-1 uppercase tracking-[0.2em] font-mono font-semibold">Livekit Agent Worker v1.0</p>

            {/* Bar Visualizer */}
            {agentAudioTrackRef && (
                <div className="relative z-10 mt-8 w-full max-w-xs flex justify-center h-8 opacity-70">
                    <BarVisualizer 
                        trackRef={agentAudioTrackRef} 
                        state={agentState} 
                        barCount={15} 
                        className="flex gap-1 items-end w-full h-full text-[#2b4c3f]"
                    />
                </div>
            )}
        </div>
    );
}

export default AgentCard;
