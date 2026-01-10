import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

function ResumeHeader({ resumesCount, maxSlots, onUpload }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight mt-4 mb-2">Stored Resumes List</h1>
                <p className="text-slate-400 max-w-2xl leading-relaxed">
                    Manage your uploaded resumes. Set a document as active to use it as context for your upcoming technical interviews.
                </p>
            </div>
            <motion.button
                whileHover={resumesCount < maxSlots ? { scale: 1.02 } : {}}
                whileTap={resumesCount < maxSlots ? { scale: 0.98 } : {}}
                onClick={onUpload}
                disabled={resumesCount >= maxSlots}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white px-6 py-3.5 rounded-xl font-bold transition shadow-lg shadow-blue-500/20"
            >
                <Plus className="w-5 h-5" />
                {resumesCount >= maxSlots ? 'Limit Reached' : 'Upload New'}
            </motion.button>
        </div>
    );
}

export default ResumeHeader;
