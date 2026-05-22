import { Info } from 'lucide-react';

function ActiveResumeNotice() {
    return (
        <div className="bg-white border border-[#e7e5e0] rounded-xl p-6 flex gap-4 md:items-center shadow-sm">
            <div className="shrink-0 w-10 h-10 bg-[#f5f4f0] text-[#57534e] rounded-lg flex items-center justify-center">
                <Info className="w-5 h-5" />
            </div>
            <p className="text-[#57534e] text-sm leading-relaxed">
                <span className="text-[#1c1917] font-semibold">The current active resume</span> is used by our AI models to personalize interview questions, tailor coding challenges, and provide industry-specific feedback during your sessions.
            </p>
        </div>
    );
}

export default ActiveResumeNotice;
