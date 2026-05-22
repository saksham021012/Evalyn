import React from 'react';

export default function ConnectingRoom({ isFetchingToken, tokenData, tokenError }) {
    if (isFetchingToken || (!tokenData && !tokenError)) {
        return (
            <div className="min-h-screen bg-[#f5f4f0]" style={{
                backgroundImage: 'linear-gradient(to right, rgba(28,25,23,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(28,25,23,0.03) 1px, transparent 1px)',
                backgroundSize: '32px 32px'
            }}>
                <div className="flex h-screen items-center justify-center">
                    <div className="text-center max-w-sm px-6">
                        <div className="w-12 h-12 border-[3px] border-[#e7e5e0] border-t-[#2b4c3f] rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-[#1c1917] font-semibold mb-2">Connecting to LiveKit Room...</p>
                        <p className="text-[#57534e] text-xs leading-relaxed">
                            Initializing audio pipelines and waking up the AI interviewer. Please wait.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    return null;
}
