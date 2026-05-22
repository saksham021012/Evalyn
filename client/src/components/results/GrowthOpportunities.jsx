import { TrendingUp } from 'lucide-react';

function GrowthOpportunities({ opportunities }) {
    return (
        <div className="bg-white border border-[#e7e5e0] rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#b45309]/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#b45309]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1c1917] font-serif">Growth Opportunities</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {opportunities.map((opportunity, index) => (
                    <div key={index}>
                        <h3 className="text-[#1c1917] font-bold text-base mb-2">{opportunity.title}</h3>
                        <p className="text-[#57534e] text-sm leading-relaxed">{opportunity.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GrowthOpportunities;
