import React from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function ProgressCard({ sessionId, progress, isGradingComplete, insightText }) {
    return (
        <div className="flex-1 w-full bg-white border border-[#e7e5e0] rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[#a8a29e] uppercase tracking-wider">Session ID:</span>
                    <span className="font-mono text-[10px] text-[#57534e] font-semibold">{sessionId.slice(-6)}</span>
                </div>
                <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-widest border ${
                    isGradingComplete 
                        ? 'bg-[#2b4c3f]/10 text-[#2b4c3f] border-[#2b4c3f]/20' 
                        : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                }`}>
                    {isGradingComplete ? 'Grading Complete' : 'AI Grading In Progress'}
                </span>
            </div>

            {/* Circular Progress Visual */}
            <div className="text-center mb-8">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border relative bg-[#faf9f6] border-[#e7e5e0]">
                    {isGradingComplete ? (
                        <CheckCircle2 className="w-12 h-12 text-[#2b4c3f] scale-110 transition-transform duration-500" />
                    ) : (
                        <>
                            <Loader2 className="w-12 h-12 text-[#2b4c3f] animate-spin opacity-40" />
                            <span className="absolute font-mono text-sm font-bold text-[#2b4c3f]">{progress}%</span>
                        </>
                    )}
                </div>
                <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#1c1917] tracking-tight mb-2">
                    {isGradingComplete ? 'Evaluation Completed' : 'Analyzing Performance'}
                </h1>
                <p className="text-[#57534e] text-xs max-w-md mx-auto leading-relaxed">
                    {isGradingComplete 
                        ? 'We have completed analyzing your transcript. Your detailed resume alignment and skill scoring report is ready.'
                        : 'Our agent is processing the audio transcripts, evaluating technical answers, and generating personalized growth feedback.'
                    }
                </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#e7e5e0] rounded-full h-1.5 mb-2 overflow-hidden">
                <div 
                    className={`h-1.5 rounded-full transition-all duration-1000 ${
                        isGradingComplete ? 'bg-[#2b4c3f]' : 'bg-[#2b4c3f] animate-pulse'
                    }`}
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-[#a8a29e] uppercase tracking-wider mb-8">
                <span>Report Compilation</span>
                <span>{progress}%</span>
            </div>

            {/* Interactive Insights Section */}
            <div className="bg-[#faf9f6] border border-[#f0ede8] rounded-xl p-4 min-h-[90px] flex flex-col justify-between">
                <span className="font-mono text-[9px] text-[#a8a29e] uppercase tracking-wider block mb-1">
                    💡 Interviewing Tip
                </span>
                <p className="text-xs text-[#57534e] leading-relaxed transition-all duration-300">
                    {insightText}
                </p>
            </div>
        </div>
    );
}
