import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConnectionFailed({ tokenError, onRetry }) {
    if (tokenError) {
        return (
            <div className="min-h-screen bg-[#f5f4f0] flex items-center justify-center" style={{
                backgroundImage: 'linear-gradient(to right, rgba(28,25,23,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(28,25,23,0.03) 1px, transparent 1px)',
                backgroundSize: '32px 32px'
            }}>
                <div className="max-w-md w-full mx-auto px-6 py-8 bg-white border border-[#e7e5e0] rounded-2xl text-center shadow-sm">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold mb-2 font-serif text-[#1c1917]">Connection Failed</h2>
                    <p className="text-[#57534e] text-sm leading-relaxed mb-6">
                        {tokenError}. Make sure your backend `.env` variables (LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET) are fully configured and correct.
                    </p>
                    <button
                        onClick={onRetry}
                        className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-mono text-[10px] tracking-[0.2em] font-bold uppercase transition"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }
    return null;
}
