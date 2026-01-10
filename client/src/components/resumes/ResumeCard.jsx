import { motion } from 'framer-motion';
import { FileText, Download, Trash2, CheckCircle2 } from 'lucide-react';

function ResumeCard({ resume, index, onSetActive, onDownload, onDelete }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`group relative bg-slate-900/40 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 hover:bg-slate-900/60 ${resume.isActive ? 'border-blue-500/50 shadow-lg shadow-blue-500/5' : 'border-slate-800 hover:border-slate-700'}`}
        >
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* File Icon */}
                <div className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${resume.isActive ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700 group-hover:text-slate-300'}`}>
                    <FileText className="w-7 h-7" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5 leading-none">
                        <h3 className="font-bold text-white text-lg truncate tracking-tight">{resume.fileName}</h3>
                        {resume.isActive && (
                            <span className="bg-blue-500/10 text-blue-500 text-[10px] font-black tracking-widest px-2 py-0.5 rounded uppercase">Current</span>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold tracking-widest text-slate-500 uppercase">
                        <span className="flex items-center gap-1.5">{new Date(resume.createdAt).toLocaleDateString()}</span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full" />
                        <span>{(resume.fileSize / (1024 * 1024)).toFixed(1)} MB</span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full" />
                        <span className="text-slate-400">{resume.targetRole}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 lg:border-l lg:border-slate-800 lg:pl-6">
                    {resume.isActive ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-lg leading-none tracking-tight">
                            <CheckCircle2 className="w-4 h-4" />
                            Active
                        </div>
                    ) : (
                        <button
                            onClick={() => onSetActive(resume._id)}
                            className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white text-xs font-bold rounded-lg transition-colors leading-none tracking-tight"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Set as Active
                        </button>
                    )}

                    <div className="w-px h-6 bg-slate-800 mx-2" />

                    <button
                        onClick={() => onDownload(resume._id, resume.fileName)}
                        className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                        title="Download"
                    >
                        <Download className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => onDelete(resume._id)}
                        className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
                        title="Delete"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default ResumeCard;
