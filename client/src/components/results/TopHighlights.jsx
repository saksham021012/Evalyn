import { CheckCircle } from 'lucide-react';

function TopHighlights({ highlights }) {
    const getLevelColor = (level) => {
        switch (level) {
            case 'EXPERT':
                return 'text-emerald-800 bg-emerald-50 border border-emerald-200/50';
            case 'FLUENT':
                return 'text-teal-800 bg-teal-50 border border-teal-200/50';
            default:
                return 'text-stone-700 bg-stone-100 border border-stone-200/50';
        }
    };

    return (
        <div className="bg-white border border-[#e7e5e0] rounded-xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1c1917] mb-6 font-serif">Top Highlights</h2>

            <div className="space-y-6">
                {highlights.map((highlight, index) => (
                    <div key={index} className="border-b border-[#e7e5e0] pb-4 last:border-0 last:pb-0">
                        <div className={`inline-block px-3 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider mb-2 ${getLevelColor(highlight.level)}`}>
                            {highlight.level}
                        </div>
                        <h3 className="text-[#1c1917] font-bold text-base mb-1">{highlight.title}</h3>
                        <p className="text-[#57534e] text-sm leading-relaxed">{highlight.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TopHighlights;
