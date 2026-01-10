import { Lightbulb } from 'lucide-react';

function KeyTakeaways({ takeaways }) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">Key Takeaways</h2>
            </div>

            <ul className="space-y-4">
                {takeaways.map((takeaway, index) => (
                    <li key={index} className="flex gap-3 text-gray-300">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{typeof takeaway === 'object' ? takeaway.text : takeaway}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default KeyTakeaways;
