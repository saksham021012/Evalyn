import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function AnalyzingPerformance({ isFinalizing, evaluationProgress }) {
    if (isFinalizing) {
        return (
            <div className="min-h-screen bg-[#f5f4f0] flex flex-col items-center justify-center p-8" style={{
                backgroundImage: 'linear-gradient(to right, rgba(28,25,23,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(28,25,23,0.03) 1px, transparent 1px)',
                backgroundSize: '32px 32px'
            }}>
                <div className="max-w-md w-full text-center bg-white border border-[#e7e5e0] rounded-2xl p-10 shadow-sm">
                    <div className="w-20 h-20 bg-[#2b4c3f]/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#2b4c3f]/10 animate-pulse">
                        <ShieldCheck className="w-10 h-10 text-[#2b4c3f] animate-pulse" />
                    </div>
                    <h1 className="text-2xl font-bold mb-3 font-serif text-[#1c1917] tracking-tight">
                        Analyzing Performance
                    </h1>
                    <p className="text-[#57534e] text-xs leading-relaxed mb-8">
                        The interviewer has completed. Our AI model is cleaning up the audio transcripts, extracting questions asked, and scoring your performance feedback.
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#e7e5e0] rounded-full h-1.5 mb-3 overflow-hidden">
                        <div 
                            className="bg-[#2b4c3f] h-1.5 rounded-full transition-all duration-700" 
                            style={{ width: `${evaluationProgress}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-[#a8a29e] font-mono uppercase tracking-widest font-semibold">
                        <span>Progress</span>
                        <span>{evaluationProgress}%</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
}
