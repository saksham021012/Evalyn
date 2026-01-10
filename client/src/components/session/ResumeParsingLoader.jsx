import { motion } from 'framer-motion';
import { FileText, CheckCircle, Loader2 } from 'lucide-react';

function ResumeParsingLoader({ fileName }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
        >
            <div className="flex items-center gap-4">
                <div className="relative">
                    <FileText className="w-12 h-12 text-blue-500" />
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="absolute -top-1 -right-1"
                    >
                        <Loader2 className="w-5 h-5 text-blue-400" />
                    </motion.div>
                </div>

                <div className="flex-1">
                    <p className="text-white font-medium mb-1">{fileName}</p>
                    <div className="space-y-2">
                        <ParsingStep label="Extracting text" status="complete" />
                        <ParsingStep label="Analyzing skills" status="active" />
                        <ParsingStep label="Evaluating experience" status="pending" />
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '66%' }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                    className="h-full bg-blue-500"
                />
            </div>
            <p className="text-gray-400 text-sm mt-2 text-center">Parsing resume with AI...</p>
        </motion.div>
    );
}

function ParsingStep({ label, status }) {
    return (
        <div className="flex items-center gap-2">
            {status === 'complete' && <CheckCircle className="w-4 h-4 text-green-400" />}
            {status === 'active' && (
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                >
                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                </motion.div>
            )}
            {status === 'pending' && <div className="w-4 h-4 rounded-full border-2 border-slate-600" />}
            <span className={`text-sm ${status === 'complete' ? 'text-green-400' :
                status === 'active' ? 'text-blue-400' :
                    'text-gray-500'
                }`}>
                {label}
            </span>
        </div>
    );
}

export default ResumeParsingLoader;
