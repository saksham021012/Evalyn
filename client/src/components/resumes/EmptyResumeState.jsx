import { FileText } from 'lucide-react';

function EmptyResumeState({ onUpload }) {
    return (
        <div className="text-center py-20 bg-white border border-dashed border-[#d4d0c9] rounded-2xl shadow-sm">
            <div className="w-16 h-16 bg-[#f5f4f0] text-[#a8a29e] rounded-xl flex items-center justify-center mx-auto mb-5">
                <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-[#1c1917] font-bold text-xl mb-2 font-serif tracking-tight">No Resumes Found</h3>
            <p className="text-[#57534e] max-w-sm mx-auto mb-8 text-sm">
                Upload your first resume to start getting personalized interview sessions.
            </p>
            <button
                onClick={onUpload}
                className="bg-[#2b4c3f] hover:bg-[#2b4c3f]/90 text-white px-8 py-3.5 rounded-xl font-mono text-[10px] tracking-[0.2em] font-bold uppercase transition shadow-sm"
            >
                Upload Now
            </button>
        </div>
    );
}

export default EmptyResumeState;
