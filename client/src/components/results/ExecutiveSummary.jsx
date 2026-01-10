import { FileText } from 'lucide-react';

function ExecutiveSummary({ score, recommendation, description }) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Executive Summary</h2>
                </div>
                <div className="text-right">
                    <div className="text-5xl font-bold text-blue-500">{Math.round(score)}/100</div>
                    <p className="text-gray-400 text-sm mt-1">PERFORMANCE SCORE</p>
                </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-3">{recommendation}</h3>
            <p className="text-gray-300 leading-relaxed">{description}</p>
        </div>
    );
}

export default ExecutiveSummary;
