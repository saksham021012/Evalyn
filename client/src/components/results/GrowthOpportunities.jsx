import { TrendingUp } from 'lucide-react';

function GrowthOpportunities({ opportunities }) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">Growth Opportunities</h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {opportunities.map((opportunity, index) => (
                    <div key={index}>
                        <h3 className="text-white font-semibold mb-2">{opportunity.title}</h3>
                        <p className="text-gray-400 text-sm">{opportunity.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GrowthOpportunities;
