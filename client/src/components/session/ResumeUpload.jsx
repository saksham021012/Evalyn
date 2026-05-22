import { useState } from 'react';
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
                <label className="block font-mono text-[10px] tracking-[0.25em] uppercase text-[#a8a29e] mb-3 font-semibold">
                    RESUME UPLOAD
                </label>
                <ResumeParsingLoader fileName={resumeFile.name} />
            </div>
        );
    }

    return (
        <div className="mb-8">
            <label className="block font-mono text-[10px] tracking-[0.25em] uppercase text-[#a8a29e] mb-3 font-semibold">
                RESUME UPLOAD
            </label>
            <div
                onDragOver={isLimitReached ? null : handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={isLimitReached ? null : handleDrop}
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${isDragging
                    ? 'border-[#2b4c3f] bg-[#2b4c3f]/5'
                    : resumeFile
                        ? 'border-[#2b4c3f]/50 bg-[#2b4c3f]/5'
                        : isLimitReached
                            ? 'border-[#e7e5e0] bg-[#f5f4f0] opacity-60 cursor-not-allowed'
                            : 'border-[#e7e5e0] bg-[#faf9f6] hover:border-[#d4d0c9]'
                    }`}
            >
                <div className="relative inline-block">
                    <Upload className={`w-10 h-10 mx-auto mb-4 transition-colors ${resumeFile ? 'text-[#2b4c3f]' : isLimitReached ? 'text-[#a8a29e]' : 'text-[#a8a29e]'}`} />
                    {resumeFile?.isExisting && (
                        <div className="absolute -top-1 -right-1 bg-[#2b4c3f] text-[10px] text-white px-1.5 py-0.5 rounded font-mono font-bold">
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
                            <p className="text-[#1c1917] font-medium mb-1 truncate max-w-xs">{resumeFile.name}</p>
                            <div className="flex items-center gap-2">
                                <p className="text-[#a8a29e] font-mono text-xs">
                                    {(resumeFile.size / 1024).toFixed(2)} KB
                                </p>
                                {resumeFile.isExisting && (
                                    <span className="text-[#2b4c3f] text-[10px] font-bold uppercase font-mono tracking-widest bg-[#2b4c3f]/10 px-2 py-0.5 rounded border border-[#2b4c3f]/20">
                                        Recent Resume
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleRemove}
                                className="text-[#57534e] hover:text-[#1c1917] text-xs font-mono tracking-widest uppercase mt-4 font-bold transition-colors inline-flex items-center gap-2"
                            >
                                ✕ Remove
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div>
                        <p className="text-[#1c1917] font-medium mb-1">
                            {isLimitReached ? 'Upload Limit Reached' : 'Drag and drop your PDF resume'}
                        </p>
                        <p className="text-[#57534e] text-sm mb-6">
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
                            className={`inline-block px-8 py-2.5 rounded-xl font-mono text-[10px] tracking-[0.2em] uppercase font-bold transition-all ${isLimitReached
                                ? 'bg-[#e7e5e0] text-[#a8a29e] cursor-not-allowed'
                                : 'bg-white border border-[#e7e5e0] text-[#1c1917] hover:bg-[#f5f4f0] cursor-pointer shadow-sm'
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
