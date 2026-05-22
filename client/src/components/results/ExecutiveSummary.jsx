import { FileText } from 'lucide-react';

function ExecutiveSummary({ score, recommendation, description }) {
    return (
        <div className="bg-white border border-[#e7e5e0] rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2b4c3f]/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#2b4c3f]" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#1c1917] font-serif">Executive Summary</h2>
                </div>
                <div className="text-right">
                    <div className="text-4xl sm:text-5xl font-bold text-[#2b4c3f] tracking-tight">{Math.round(score)}/100</div>
                    <p className="text-[#a8a29e] text-[10px] font-mono tracking-[0.2em] mt-1">PERFORMANCE SCORE</p>
                </div>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#1c1917] mb-3">{recommendation}</h3>
            <p className="text-[#44403c] leading-relaxed text-sm sm:text-base font-sans">{description}</p>
        </div>
    );
}

export default ExecutiveSummary;
