import { motion } from 'framer-motion';
import { BarChart3, Trash2 } from 'lucide-react';

function HistoryTable({ interviews, loading, navigate, onDelete }) {

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'hard': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'easy': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
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
            className="bg-[#0f0f10] border border-[#1a1a1b] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/50"
        >
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-[#1a1a1b] bg-[#121213]">
                        <th className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 text-[10px] font-black text-[#4a4a4b] tracking-[0.2em] uppercase">Date</th>
                        <th className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 text-[10px] font-black text-[#4a4a4b] tracking-[0.2em] uppercase">Role</th>
                        <th className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 text-[10px] font-black text-[#4a4a4b] tracking-[0.2em] uppercase hidden md:table-cell">Difficulty</th>
                        <th className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 text-[10px] font-black text-[#4a4a4b] tracking-[0.2em] uppercase hidden lg:table-cell">Duration</th>
                        <th className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 text-[10px] font-black text-[#4a4a4b] tracking-[0.2em] uppercase">Score</th>
                        <th className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 text-[10px] font-black text-[#4a4a4b] tracking-[0.2em] uppercase">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1b]">
                    {loading ? (
                        <tr>
                            <td colSpan="6" className="px-10 py-20 text-center">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                    <p className="text-[#3a3a3b] font-bold text-xs tracking-widest uppercase">Fetching Sessions</p>
                                </div>
                            </td>
                        </tr>
                    ) : interviews.length > 0 ? (
                        interviews.map((interview, index) => (
                            <motion.tr
                                key={interview._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                                onClick={() => navigate(`/interview/results/${interview._id}`)}
                            >
                                <td className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8 text-xs sm:text-sm text-[#8a8a8b] font-medium">{formatDate(interview.createdAt)}</td>
                                <td className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8 text-xs sm:text-sm text-white font-bold tracking-tight">{interview.role}</td>
                                <td className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8 hidden md:table-cell">
                                    <span className={`px-3 py-1 rounded text-[10px] font-black border uppercase tracking-wider ${getDifficultyColor(interview.difficulty)}`}>
                                        {interview.difficulty}
                                    </span>
                                </td>
                                <td className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8 text-xs sm:text-sm text-[#8a8a8b] font-medium hidden lg:table-cell">{calculateDuration(interview)}</td>
                                <td className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
                                    <span className="text-white font-bold text-base sm:text-lg tracking-tighter">
                                        {interview.status === 'completed'
                                            ? `${Math.round(interview.overallEvaluation?.percentage || 0)}/100`
                                            : <span className="text-[#3a3a3b] italic">In Progress</span>}
                                    </span>
                                </td>
                                <td className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
                                    <div className="flex items-center gap-2 sm:gap-4">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/interview/results/${interview._id}`);
                                            }}
                                            className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
                                            title="View Results"
                                        >
                                            <BarChart3 className="w-5 h-5" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => onDelete(e, interview._id)}
                                            className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300"
                                            title="Delete Session"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="px-10 py-20 text-center text-[#3a3a3b] font-bold tracking-widest uppercase text-xs">
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
