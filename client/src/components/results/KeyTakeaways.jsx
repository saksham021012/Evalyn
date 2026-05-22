import { Lightbulb } from 'lucide-react';

function KeyTakeaways({ takeaways }) {
    return (
        <div className="bg-white border border-[#e7e5e0] rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#b45309]/10 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-[#b45309]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1c1917] font-serif">Key Takeaways</h2>
            </div>

            <ul className="space-y-4">
                {takeaways.map((takeaway, index) => (
                    <li key={index} className="flex gap-3 text-[#44403c] text-sm sm:text-base font-sans">
                        <span className="text-[#2b4c3f] mt-1 font-bold">•</span>
                        <span>{typeof takeaway === 'object' ? takeaway.text : takeaway}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default KeyTakeaways;
