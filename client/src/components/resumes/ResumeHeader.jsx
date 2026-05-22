import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

function ResumeHeader({ resumesCount, maxSlots, onUpload }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 mt-4">
            <div>
                <h1 className="font-serif text-3xl font-bold text-[#1c1917] tracking-tight mb-2">Stored Resumes List</h1>
                <p className="text-[#57534e] max-w-2xl leading-relaxed text-sm">
                    Manage your uploaded resumes. Set a document as active to use it as context for your upcoming technical interviews.
                </p>
            </div>
            <motion.button
                whileHover={resumesCount < maxSlots ? { scale: 1.02 } : {}}
                whileTap={resumesCount < maxSlots ? { scale: 0.98 } : {}}
                onClick={onUpload}
                disabled={resumesCount >= maxSlots}
                className="flex items-center justify-center gap-2 bg-[#2b4c3f] hover:bg-[#2b4c3f]/90 disabled:bg-[#e7e5e0] disabled:text-[#a8a29e] disabled:cursor-not-allowed text-white px-6 py-3.5 rounded-xl font-mono text-[10px] tracking-[0.2em] uppercase font-bold transition shadow-sm"
            >
                <Plus className="w-4 h-4" />
                {resumesCount >= maxSlots ? 'Limit Reached' : 'Upload New'}
            </motion.button>
        </div>
    );
}

export default ResumeHeader;
