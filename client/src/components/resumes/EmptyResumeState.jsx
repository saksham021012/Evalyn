import { FileText } from 'lucide-react';

function EmptyResumeState({ onUpload }) {
    return (
        <div className="text-center py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
            <div className="w-16 h-16 bg-slate-800 text-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-white font-bold text-xl mb-2">No Resumes Found</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-6">
                Upload your first resume to start getting personalized interview sessions.
            </p>
            <button
                onClick={onUpload}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition"
            >
                Upload Now
            </button>
        </div>
    );
}

export default EmptyResumeState;
