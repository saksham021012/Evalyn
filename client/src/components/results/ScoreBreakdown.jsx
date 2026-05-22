import { BarChart3 } from 'lucide-react';

function ScoreBreakdown({ scores }) {
    return (
        <div className="bg-white border border-[#e7e5e0] rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#2b4c3f]/10 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-[#2b4c3f]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1c1917] font-serif">Score Breakdown</h2>
            </div>

            <div className="space-y-6">
                {scores.map((item, index) => (
                    <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[#78716c] text-xs font-mono tracking-wider uppercase">{item.category}</span>
                            <span className="text-[#1c1917] font-semibold text-sm">{Math.round(item.score)}/100</span>
                        </div>
                        <div className="bg-[#f5f4f0] rounded-full h-2">
                            <div
                                className="bg-[#2b4c3f] h-2 rounded-full transition-all"
                                style={{ width: `${Math.min(Math.round(item.score), 100)}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ScoreBreakdown;
