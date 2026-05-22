import { Volume2, AlertCircle } from 'lucide-react';

function TranscriptionPanel({ messages, transcriptContainerRef }) {
    return (
        <div className="lg:col-span-5 flex flex-col bg-white border border-[#e7e5e0] rounded-2xl overflow-hidden shadow-sm" style={{ maxHeight: '640px' }}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#e7e5e0] bg-[#faf9f6] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-[#2b4c3f]" />
                    <span className="text-xs font-bold text-[#1c1917] tracking-[0.2em] uppercase font-mono">Live Subtitles</span>
                </div>
            </div>

            {/* Subtitle Dialogue Items — scrollable, does NOT push viewport */}
            <div 
                ref={transcriptContainerRef}
                className="flex-1 p-6 overflow-y-auto overscroll-contain flex flex-col gap-4 min-h-0 bg-white scroll-smooth"
            >
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
                            <span className={`text-[9px] font-bold uppercase font-mono tracking-[0.2em] mb-1.5 ${
                                isSystem ? 'text-[#a8a29e]' : isAgent ? 'text-[#2b4c3f]' : 'text-[#57534e]'
                            }`}>
                                {msg.sender}
                            </span>
                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                isSystem 
                                ? 'bg-[#f5f4f0] border border-[#e7e5e0] text-[#57534e] rounded-xl' 
                                : isAgent 
                                ? 'bg-[#2b4c3f]/5 border border-[#2b4c3f]/10 text-[#2b4c3f] rounded-tl-sm' 
                                : 'bg-[#faf9f6] border border-[#e7e5e0] text-[#1c1917] rounded-tr-sm'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Instructions Box */}
            <div className="p-4 bg-[#faf9f6] border-t border-[#e7e5e0] text-[10px] text-[#a8a29e] flex gap-2 items-start font-mono leading-relaxed tracking-wide shrink-0">
                <AlertCircle className="w-4 h-4 text-[#2b4c3f] shrink-0 mt-0.5" />
                <div>
                    <span>Speech is automatically transcribed. Tap the red button to finish the session whenever you are ready.</span>
                </div>
            </div>
        </div>
    );
}

export default TranscriptionPanel;
