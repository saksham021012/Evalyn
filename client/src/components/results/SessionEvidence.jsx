import { FileText, Code, StickyNote, ChevronRight } from 'lucide-react';

function SessionEvidence({ evidence }) {
    if (!evidence || evidence.length === 0) return null;

    return (
        <div className="bg-white border border-[#e7e5e0] rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#2b4c3f]/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#2b4c3f]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1c1917] font-serif">Full Transcript</h2>
            </div>

            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {evidence.map((item, index) => (
                    <div key={index} className="border-b border-[#e7e5e0] pb-4 last:border-0 last:pb-0">
                        <h3 className="text-[#1c1917] font-bold text-sm sm:text-base mb-2">
                            Q{index + 1}: {item.question}
                        </h3>
                        <div className="bg-[#f5f4f0]/80 rounded-xl p-4 border border-[#e7e5e0]">
                            <p className="text-[#44403c] text-sm italic leading-relaxed">
                                "{item.transcript}"
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SessionEvidence;
