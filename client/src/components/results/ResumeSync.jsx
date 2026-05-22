import { CheckCircle } from 'lucide-react';

function ResumeSync({ items }) {
    return (
        <div className="bg-white border border-[#e7e5e0] rounded-xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1c1917] mb-6 font-serif">Resume Sync</h2>

            <div className="space-y-4">
                {(items || []).map((item, index) => (
                    <div key={index} className="flex items-start gap-3 border-b border-[#e7e5e0] pb-4 last:border-0 last:pb-0">
                        <CheckCircle className="w-5 h-5 text-[#2b4c3f] mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-[#1c1917] font-bold text-base mb-1">{item.title}</h3>
                            <p className="text-[#57534e] text-sm leading-relaxed">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ResumeSync;
