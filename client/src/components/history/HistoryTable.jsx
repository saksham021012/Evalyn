import { motion } from 'framer-motion';
import { BarChart3, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import HistorySkeletonRow from './HistorySkeletonRow';

function HistoryTable({ interviews, loading, navigate, onDelete }) {

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'hard': return 'text-red-700 bg-red-50 border-red-200';
            case 'medium': return 'text-amber-700 bg-amber-50 border-amber-200';
            case 'easy': return 'text-[#2b4c3f] bg-[#2b4c3f]/10 border-[#2b4c3f]/20';
            default: return 'text-[#57534e] bg-[#f5f4f0] border-[#e7e5e0]';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });
    };

    const calculateDuration = (interview) => {
        if (!interview.startedAt || !interview.completedAt) return '-';
        const start = new Date(interview.startedAt);
        const end = new Date(interview.completedAt);
        const diffMs = end - start;
        const diffMins = Math.round(diffMs / 60000);
        return `${Math.max(1, diffMins)} mins`; // Show at least 1 min
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#e7e5e0] rounded-xl overflow-hidden shadow-sm"
        >
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-[#e7e5e0] bg-[#faf9f6]">
                        <th className="px-4 sm:px-6 py-4 font-mono text-[9px] font-semibold text-[#a8a29e] tracking-[0.2em] uppercase">Date</th>
                        <th className="px-4 sm:px-6 py-4 font-mono text-[9px] font-semibold text-[#a8a29e] tracking-[0.2em] uppercase">Role</th>
                        <th className="px-4 sm:px-6 py-4 font-mono text-[9px] font-semibold text-[#a8a29e] tracking-[0.2em] uppercase hidden md:table-cell">Difficulty</th>
                        <th className="px-4 sm:px-6 py-4 font-mono text-[9px] font-semibold text-[#a8a29e] tracking-[0.2em] uppercase hidden lg:table-cell">Duration</th>
                        <th className="px-4 sm:px-6 py-4 font-mono text-[9px] font-semibold text-[#a8a29e] tracking-[0.2em] uppercase">Score</th>
                        <th className="px-4 sm:px-6 py-4 font-mono text-[9px] font-semibold text-[#a8a29e] tracking-[0.2em] uppercase">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ede8]">
                    {loading ? (
                        [1, 2, 3, 4, 5].map(i => <HistorySkeletonRow key={i} />)
                    ) : interviews.length > 0 ? (
                        interviews.map((interview, index) => (
                            <motion.tr
                                key={interview._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-[#f5f4f0] transition-colors group cursor-pointer"
                                onClick={() => {
                                    if (interview.status === 'grading') {
                                        toast.error("Evaluation is in progress. Please wait for the report to compile.");
                                    } else {
                                        navigate(`/interview/results/${interview._id}`);
                                    }
                                }}
                            >
                                <td className="px-4 sm:px-6 py-5 text-xs text-[#a8a29e] font-mono">{formatDate(interview.createdAt)}</td>
                                <td className="px-4 sm:px-6 py-5 text-sm text-[#1c1917] font-medium tracking-tight">{interview.role}</td>
                                <td className="px-4 sm:px-6 py-5 hidden md:table-cell">
                                    <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-widest border ${getDifficultyColor(interview.difficulty)}`}>
                                        {interview.difficulty}
                                    </span>
                                </td>
                                <td className="px-4 sm:px-6 py-5 text-xs text-[#57534e] font-mono hidden lg:table-cell">{calculateDuration(interview)}</td>
                                <td className="px-4 sm:px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        {interview.status === 'completed' ? (
                                            <>
                                                <div className="flex-1 min-w-[50px] max-w-[80px] bg-[#e7e5e0] rounded-full h-1.5 hidden sm:block">
                                                    <div
                                                        className="bg-[#2b4c3f] h-1.5 rounded-full"
                                                        style={{ width: `${interview.overallEvaluation?.percentage || 0}%` }}
                                                    />
                                                </div>
                                                <span className="text-[#1c1917] font-bold text-xs font-mono whitespace-nowrap">
                                                    {Math.round(interview.overallEvaluation?.percentage || 0)}/100
                                                </span>
                                            </>
                                        ) : interview.status === 'grading' ? (
                                            <span className="text-amber-600 font-bold text-[10px] font-mono tracking-wider whitespace-nowrap animate-pulse">
                                                Grading...
                                            </span>
                                        ) : (
                                            <span className="text-[#a8a29e] text-xs font-mono italic">In Progress</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 sm:px-6 py-5">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <motion.button
                                            whileHover={interview.status === 'grading' ? {} : { scale: 1.08 }}
                                            whileTap={interview.status === 'grading' ? {} : { scale: 0.93 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (interview.status === 'grading') {
                                                    toast.error("Evaluation is in progress. Please wait for the report to compile.");
                                                } else {
                                                    navigate(`/interview/results/${interview._id}`);
                                                }
                                            }}
                                            className={`p-1.5 rounded-lg transition-all duration-200 ${
                                                interview.status === 'grading'
                                                    ? 'bg-amber-50 text-amber-500 border border-amber-200 cursor-not-allowed'
                                                    : 'bg-[#2b4c3f]/[0.08] text-[#2b4c3f] hover:bg-[#2b4c3f] hover:text-white'
                                            }`}
                                            title={interview.status === 'grading' ? "Evaluation In Progress" : "View Results"}
                                        >
                                            <BarChart3 className="w-4 h-4" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.08 }}
                                            whileTap={{ scale: 0.93 }}
                                            onClick={(e) => onDelete(e, interview._id)}
                                            className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200"
                                            title="Delete Session"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="px-10 py-20 text-center text-[#a8a29e] font-mono font-bold tracking-widest uppercase text-[10px]">
                                No sessions found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </motion.div>
    );
}

export default HistoryTable;
