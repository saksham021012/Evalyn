import { BarChart3 } from 'lucide-react';

function ScoreBreakdown({ scores }) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">Score Breakdown</h2>
            </div>

            <div className="space-y-6">
                {scores.map((item, index) => (
                    <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400 text-sm uppercase">{item.category}</span>
                            <span className="text-white font-bold">{Math.round(item.score)}/100</span>
                        </div>
                        <div className="bg-slate-800 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all"
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
