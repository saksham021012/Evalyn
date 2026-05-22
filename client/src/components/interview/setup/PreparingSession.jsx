import React from 'react';

export default function PreparingSession({ loading, interviewSession }) {
    if (!interviewSession && loading) {
        return (
            <div className="min-h-screen bg-[#f5f4f0]" style={{
                backgroundImage: 'linear-gradient(to right, rgba(28,25,23,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(28,25,23,0.03) 1px, transparent 1px)',
                backgroundSize: '32px 32px'
            }}>
                <div className="flex h-screen items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 border-[3px] border-[#e7e5e0] border-t-[#2b4c3f] rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-[#a8a29e] font-mono font-semibold tracking-widest uppercase text-xs">Preparing your interview session...</p>
                    </div>
                </div>
            </div>
        );
    }
    return null;
}
