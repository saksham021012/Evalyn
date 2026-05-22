import { Volume2, AlertCircle } from 'lucide-react';

function TranscriptionPanel({ messages, transcriptEndRef }) {
    return (
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
    );
}

export default TranscriptionPanel;
