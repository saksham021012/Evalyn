import { FileText, Code, StickyNote, ChevronRight } from 'lucide-react';

function SessionEvidence({ evidence }) {
    if (!evidence || evidence.length === 0) return null;

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">Full Transcript</h2>
            </div>

            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {evidence.map((item, index) => (
                    <div key={index} className="border-b border-slate-800 pb-4 last:border-0 last:pb-0">
                        <h3 className="text-white font-semibold text-sm mb-2">
                            Q{index + 1}: {item.question}
                        </h3>
                        <div className="bg-black/50 rounded-lg p-4 border border-slate-800">
                            <p className="text-gray-400 text-sm italic leading-relaxed">
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
