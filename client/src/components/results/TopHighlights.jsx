import { CheckCircle } from 'lucide-react';

function TopHighlights({ highlights }) {
    const getLevelColor = (level) => {
        switch (level) {
            case 'EXPERT':
                return 'text-green-400 bg-green-500/10';
            case 'FLUENT':
                return 'text-blue-400 bg-blue-500/10';
            default:
                return 'text-gray-400 bg-gray-500/10';
        }
    };

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Top Highlights</h2>

            <div className="space-y-6">
                {highlights.map((highlight, index) => (
                    <div key={index}>
                        <div className={`inline-block px-3 py-1 rounded text-xs font-medium mb-2 ${getLevelColor(highlight.level)}`}>
                            {highlight.level}
                        </div>
                        <h3 className="text-white font-semibold mb-2">{highlight.title}</h3>
                        <p className="text-gray-400 text-sm">{highlight.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TopHighlights;
