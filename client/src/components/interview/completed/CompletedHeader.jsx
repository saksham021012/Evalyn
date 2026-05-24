import React from 'react';

export default function CompletedHeader() {
    return (
        <div className="px-6 py-4 border-b border-[#e7e5e0] bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#2b4c3f] rounded flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">E</span>
                </div>
                <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#1c1917]">EVALYN AI</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-[#a8a29e]">
                <span>● SESSION OVER</span>
            </div>
        </div>
    );
}
