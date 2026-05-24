import React from 'react';
import { LayoutDashboard, ArrowRight } from 'lucide-react';

export default function CompletedActions({ isGradingComplete, onGoToDashboard, onViewResults }) {
    return (
        <div className="px-6 py-5 border-t border-[#e7e5e0] bg-[#faf9f6] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
            <button
                onClick={onGoToDashboard}
                className="w-full sm:w-auto px-5 py-2.5 border border-[#e7e5e0] rounded-xl text-[#57534e] hover:bg-[#eae8e3] transition text-xs font-mono tracking-widest uppercase font-semibold flex items-center justify-center gap-2"
            >
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard
            </button>

            <button
                onClick={onViewResults}
                disabled={!isGradingComplete}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-mono tracking-widest uppercase font-semibold flex items-center justify-center gap-2 border transition duration-300 ${
                    isGradingComplete 
                        ? 'bg-[#2b4c3f] text-white border-[#2b4c3f] hover:bg-[#2b4c3f]/90' 
                        : 'bg-white text-[#a8a29e] border-[#e7e5e0] cursor-not-allowed'
                }`}
            >
                View Detailed Report
                <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}
