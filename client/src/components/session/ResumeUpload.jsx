import { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import ResumeParsingLoader from './ResumeParsingLoader';

function ResumeUpload({ resumeFile, isParsing, isLimitReached, onFileSelect, onRemove }) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && (file.type === 'application/pdf' || file.name.endsWith('.docx'))) {
            if (onFileSelect) {
                onFileSelect(file);
            }
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (onFileSelect) {
                onFileSelect(file);
            }
        }
    };

    const handleRemove = () => {
        if (onRemove) {
            onRemove();
        }
    };

    // Show parsing loader if parsing
    if (isParsing && resumeFile) {
        return (
            <div className="mb-8">
                <label className="block text-gray-400 text-xs font-medium mb-3 tracking-widest">
                    RESUME UPLOAD
                </label>
                <ResumeParsingLoader fileName={resumeFile.name} />
            </div>
        );
    }

    return (
        <div className="mb-8 font-outfit">
            <label className="block text-gray-400 text-xs font-medium mb-3 tracking-widest">
                RESUME UPLOAD
            </label>
            <div
                onDragOver={isLimitReached ? null : handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={isLimitReached ? null : handleDrop}
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${isDragging
                    ? 'border-blue-500 bg-blue-500/10'
                    : resumeFile
                        ? 'border-green-500/50 bg-green-500/5'
                        : isLimitReached
                            ? 'border-slate-800 bg-slate-900/20 opacity-60 cursor-not-allowed'
                            : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                    }`}
            >
                <div className="relative inline-block">
                    <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${resumeFile ? 'text-green-400' : isLimitReached ? 'text-slate-700' : 'text-slate-500'
                        }`} />
                    {resumeFile?.isExisting && (
                        <div className="absolute -top-1 -right-1 bg-blue-500 text-[10px] text-white px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                            REUSING
                        </div>
                    )}
                </div>

                {resumeFile ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="flex flex-col items-center">
                            <p className="text-white font-medium mb-1 truncate max-w-xs">{resumeFile.name}</p>
                            <div className="flex items-center gap-2">
                                <p className="text-slate-500 text-xs">
                                    {(resumeFile.size / 1024).toFixed(2)} KB
                                </p>
                                {resumeFile.isExisting && (
                                    <span className="text-blue-400 text-[10px] font-bold uppercase tracking-tighter bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20">
                                        Recent Resume
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleRemove}
                                className="text-blue-500 hover:text-blue-400 text-sm mt-4 font-medium transition-colors inline-flex items-center gap-2"
                            >
                                <span className="text-xs">✕</span> Remove and change
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div>
                        <p className="text-white font-medium mb-1">
                            {isLimitReached ? 'Upload Limit Reached' : 'Drag and drop your PDF resume'}
                        </p>
                        <p className="text-slate-500 text-sm mb-6">
                            {isLimitReached ? 'Delete existing resumes to upload more' : 'or click to browse files'}
                        </p>
                        <input
                            type="file"
                            accept=".pdf,.docx"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="resume-upload"
                            disabled={isLimitReached}
                        />
                        <label
                            htmlFor={isLimitReached ? "" : "resume-upload"}
                            className={`inline-block text-white px-8 py-2.5 rounded-lg transition-all font-medium ${isLimitReached
                                ? 'bg-slate-800 cursor-not-allowed opacity-50'
                                : 'bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-lg shadow-blue-500/20'
                                }`}
                        >
                            {isLimitReached ? 'Limit Reached' : 'Browse Files'}
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResumeUpload;
