import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { uploadResume } from '../../services/operations/resumeAPI';

function UploadResumeModal({ isOpen, onClose, onSuccess }) {
    const dispatch = useDispatch();
    const [file, setFile] = useState(null);
    const [targetRole, setTargetRole] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            setFile(selectedFile);
        } else {
            alert('Please select a valid PDF or DOCX file');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !targetRole) return;

        setIsUploading(true);
        try {
            const result = await dispatch(uploadResume(file, targetRole, null));
            if (result) {
                onSuccess();
                onClose();
                setFile(null);
                setTargetRole('');
            }
        } catch (error) {
            console.error('Upload component error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-[#f5f4f0] border border-[#e7e5e0] rounded-2xl overflow-hidden shadow-xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-[#e7e5e0] bg-white flex items-center justify-between">
                            <h2 className="text-xl font-bold font-serif text-[#1c1917] tracking-tight">Upload New Resume</h2>
                            <button onClick={onClose} className="p-2 hover:bg-[#f5f4f0] rounded-full transition-colors">
                                <X className="w-5 h-5 text-[#a8a29e]" />
                            </button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleSubmit} className="p-8 bg-white">
                            <div className="space-y-6">
                                {/* Role Selection */}
                                <div>
                                    <label className="block font-mono text-[10px] font-bold text-[#a8a29e] tracking-widest mb-2 uppercase">Target Role</label>
                                    <input
                                        type="text"
                                        required
                                        value={targetRole}
                                        onChange={(e) => setTargetRole(e.target.value)}
                                        placeholder="e.g. Senior Fullstack Developer"
                                        className="w-full bg-white border border-[#e7e5e0] rounded-xl px-4 py-3 text-[#1c1917] focus:outline-none focus:border-[#2b4c3f] transition-colors shadow-sm placeholder-[#a8a29e]"
                                    />
                                </div>

                                {/* File Dropzone */}
                                <div>
                                    <label className="block font-mono text-[10px] font-bold text-[#a8a29e] tracking-widest mb-3 uppercase">Resume File (PDF/DOCX)</label>
                                    <div className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 text-center ${file ? 'border-[#2b4c3f] bg-[#2b4c3f]/5' : 'border-[#e7e5e0] bg-[#faf9f6] hover:border-[#d4d0c9]'}`}>
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept=".pdf,.docx"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="flex flex-col items-center justify-center">
                                            {file ? (
                                                <>
                                                    <div className="w-12 h-12 bg-[#2b4c3f]/10 text-[#2b4c3f] rounded-xl flex items-center justify-center mb-3">
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <p className="text-[#1c1917] font-medium truncate max-w-[200px]">{file.name}</p>
                                                    <p className="text-[#57534e] text-[10px] font-mono font-bold mt-2 uppercase tracking-widest">Click to change</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 bg-white border border-[#e7e5e0] text-[#a8a29e] rounded-xl flex items-center justify-center mb-3 shadow-sm">
                                                        <Upload className="w-5 h-5" />
                                                    </div>
                                                    <p className="text-[#1c1917] font-medium mb-1">Drag and drop or click to upload</p>
                                                    <p className="text-[#a8a29e] font-mono text-[10px] uppercase tracking-widest mt-1">Max 5MB size</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3.5 rounded-xl border border-[#e7e5e0] bg-white text-[#57534e] hover:bg-[#f5f4f0] font-mono text-[10px] font-bold tracking-[0.2em] uppercase transition shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!file || !targetRole || isUploading}
                                    className="flex-[2] bg-[#2b4c3f] hover:bg-[#2b4c3f]/90 disabled:bg-[#e7e5e0] disabled:text-[#a8a29e] disabled:cursor-not-allowed text-white font-mono text-[10px] tracking-[0.2em] font-bold uppercase py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                                >
                                    {isUploading ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-4 h-4 border-[3px] border-[#e7e5e0]/20 border-t-white rounded-full"
                                            />
                                            Parsing Document
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            Upload & Parse
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default UploadResumeModal;
