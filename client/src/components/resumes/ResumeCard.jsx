import { motion } from 'framer-motion';
import { FileText, Download, Trash2, CheckCircle2 } from 'lucide-react';

function ResumeCard({ resume, index, onSetActive, onDownload, onDelete }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`group relative bg-white border rounded-xl p-6 transition-all duration-300 shadow-sm hover:shadow-md ${resume.isActive ? 'border-[#2b4c3f] bg-[#fcfbf9]' : 'border-[#e7e5e0] hover:border-[#d4d0c9]'}`}
        >
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* File Icon */}
                <div className={`shrink-0 w-14 h-14 rounded-lg flex items-center justify-center transition-colors ${resume.isActive ? 'bg-[#2b4c3f]/10 text-[#2b4c3f]' : 'bg-[#f5f4f0] text-[#a8a29e] group-hover:bg-[#e7e5e0] group-hover:text-[#57534e]'}`}>
                    <FileText className="w-6 h-6" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 leading-none">
                        <h3 className="font-semibold text-[#1c1917] text-lg truncate tracking-tight">{resume.fileName}</h3>
                        {resume.isActive && (
                            <span className="bg-[#2b4c3f]/10 text-[#2b4c3f] font-mono text-[9px] font-bold tracking-[0.2em] px-2 py-0.5 rounded uppercase border border-[#2b4c3f]/20">Current</span>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] tracking-widest text-[#a8a29e] uppercase font-semibold">
                        <span className="flex items-center gap-1.5">{new Date(resume.createdAt).toLocaleDateString()}</span>
                        <span className="w-1 h-1 bg-[#d4d0c9] rounded-full" />
                        <span>{(resume.fileSize / (1024 * 1024)).toFixed(1)} MB</span>
                        <span className="w-1 h-1 bg-[#d4d0c9] rounded-full" />
                        <span className="text-[#57534e]">{resume.targetRole}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 lg:border-l lg:border-[#e7e5e0] lg:pl-6">
                    {resume.isActive ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-[#2b4c3f]/10 text-[#2b4c3f] font-mono text-[10px] tracking-widest font-bold uppercase rounded-lg">
                            <CheckCircle2 className="w-4 h-4" />
                            Active
                        </div>
                    ) : (
                        <button
                            onClick={() => onSetActive(resume._id)}
                            className="flex items-center gap-2 px-4 py-2 text-[#57534e] hover:bg-[#f5f4f0] hover:text-[#1c1917] font-mono text-[10px] tracking-widest font-bold uppercase rounded-lg transition-colors"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Set Active
                        </button>
                    )}

                    <div className="w-px h-6 bg-[#e7e5e0] mx-1" />

                    <button
                        onClick={() => onDownload(resume._id, resume.fileName)}
                        className="p-2 text-[#a8a29e] hover:text-[#1c1917] hover:bg-[#f5f4f0] rounded-lg transition-all"
                        title="Download"
                    >
                        <Download className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => onDelete(resume._id)}
                        className="p-2 text-[#a8a29e] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default ResumeCard;
