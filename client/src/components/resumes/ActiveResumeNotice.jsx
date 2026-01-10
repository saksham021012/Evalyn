import { Info } from 'lucide-react';

function ActiveResumeNotice() {
    return (
        <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6 flex gap-4 md:items-center">
            <div className="shrink-0 w-10 h-10 bg-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center">
                <Info className="w-5 h-5" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
                <span className="text-white font-bold">The current active resume</span> is used by our AI models to personalize interview questions, tailor coding challenges, and provide industry-specific feedback during your sessions.
            </p>
        </div>
    );
}

export default ActiveResumeNotice;
