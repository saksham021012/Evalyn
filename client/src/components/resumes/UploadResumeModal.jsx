import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
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
            // State is reset in finally block
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
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-[#0a0a0b] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-inter"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Upload New Resume</h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="space-y-6">
                                {/* Role Selection */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 tracking-widest mb-2 uppercase">Target Role</label>
                                    <input
                                        type="text"
                                        required
                                        value={targetRole}
                                        onChange={(e) => setTargetRole(e.target.value)}
                                        placeholder="e.g. Senior Fullstack Developer"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>

                                {/* File Dropzone */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 tracking-widest mb-4 uppercase">Resume File (PDF/DOCX)</label>
                                    <div className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${file ? 'border-blue-500 bg-blue-500/5' : 'border-slate-800 hover:border-slate-700'}`}>
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept=".pdf,.docx"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="flex flex-col items-center justify-center text-center">
                                            {file ? (
                                                <>
                                                    <div className="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center mb-3">
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <p className="text-white font-medium truncate max-w-[200px]">{file.name}</p>
                                                    <p className="text-blue-500 text-xs font-bold mt-1 uppercase">Click to change</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 bg-slate-800 text-gray-400 rounded-xl flex items-center justify-center mb-3">
                                                        <Upload className="w-6 h-6" />
                                                    </div>
                                                    <p className="text-gray-400 mb-1">Drag and drop or click to upload</p>
                                                    <p className="text-gray-600 text-xs">A4 format, max 5MB size</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-10 flex gap-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-6 py-4 rounded-xl border border-slate-800 text-white font-bold hover:bg-white/5 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!file || !targetRole || isUploading}
                                    className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2"
                                >
                                    {isUploading ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                                            />
                                            Parsing Document...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-5 h-5" />
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
