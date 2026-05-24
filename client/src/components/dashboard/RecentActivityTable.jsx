import { motion } from 'framer-motion';
import { Trash2, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function RecentActivityTable({ recentActivity, onDelete, onViewResults }) {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.36 }}
            className="bg-white border border-[#e7e5e0] rounded-xl overflow-hidden shadow-sm"
        >
            {/* Table Header Bar */}
            <div className="px-5 sm:px-6 py-4 border-b border-[#e7e5e0] bg-[#faf9f6] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                    <h3 className="text-base font-semibold text-[#1c1917] tracking-tight">Recent Activity</h3>
                    <span className="bg-[#2b4c3f]/[0.08] text-[#2b4c3f] font-mono text-[9px] font-semibold tracking-[0.2em] uppercase px-2 py-0.5 rounded-md">
                        Latest Sessions
                    </span>
                </div>
                <button
                    onClick={() => navigate('/interviews')}
                    className="text-[#2b4c3f] hover:text-[#2b4c3f]/70 transition text-xs font-mono tracking-widest uppercase font-semibold flex items-center gap-1"
                >
                    Full History →
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[#e7e5e0]">
                            {['Candidate', 'Date', 'Stack', 'Score', 'Status', 'Action'].map((col, i) => (
                                <th
                                    key={col}
                                    className={`text-left font-mono text-[9px] tracking-[0.2em] uppercase text-[#a8a29e] px-4 sm:px-6 py-3 font-semibold ${
                                        i === 1 ? 'hidden sm:table-cell' :
                                        i === 2 ? 'hidden md:table-cell' :
                                        i === 4 ? 'hidden lg:table-cell' : ''
                                    }`}
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {recentActivity.map((activity, index) => (
                            <motion.tr
                                key={activity.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2, delay: 0.4 + index * 0.05 }}
                                className="border-b border-[#f0ede8] last:border-0 hover:bg-[#f5f4f0] transition-colors cursor-pointer group"
                                onClick={() => {
                                    if (activity.status === 'GRADING') {
                                        toast.error("Evaluation is in progress. Please wait for the report to compile.");
                                    } else {
                                        onViewResults(activity.id);
                                    }
                                }}
                            >
                                {/* Candidate */}
                                <td className="px-4 sm:px-6 py-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 bg-[#2b4c3f] rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-xs font-bold">{activity.avatar}</span>
                                        </div>
                                        <span className="text-[#1c1917] font-medium text-sm">{activity.candidate}</span>
                                    </div>
                                </td>

                                {/* Date */}
                                <td className="px-4 sm:px-6 py-4 text-[#a8a29e] text-xs font-mono hidden sm:table-cell">
                                    {activity.date}
                                </td>

                                {/* Stack */}
                                <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                                    <div className="flex gap-1.5 flex-wrap">
                                        {activity.stack.map((tech, i) => (
                                            <span
                                                key={i}
                                                className="bg-[#eae8e3] text-[#57534e] px-2 py-0.5 rounded font-mono text-[9px] font-semibold uppercase tracking-wide"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </td>

                                {/* Score */}
                                <td className="px-4 sm:px-6 py-4">
                                    {activity.status === 'GRADING' ? (
                                        <span className="text-amber-600 font-bold text-[10px] font-mono tracking-wider whitespace-nowrap animate-pulse">
                                            GRADING...
                                        </span>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 min-w-[50px] max-w-[80px] bg-[#e7e5e0] rounded-full h-1.5">
                                                <div
                                                    className="bg-[#2b4c3f] h-1.5 rounded-full"
                                                    style={{ width: `${activity.score}%` }}
                                                />
                                            </div>
                                            <span className="text-[#1c1917] font-bold text-xs font-mono whitespace-nowrap">
                                                {activity.score}/100
                                            </span>
                                        </div>
                                    )}
                                </td>

                                {/* Status */}
                                <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                                    <span className={`px-2.5 py-1 rounded-md font-mono text-[9px] font-bold tracking-[0.15em] uppercase border flex items-center gap-1.5 w-fit ${
                                        activity.status === 'COMPLETED'
                                            ? 'bg-[#2b4c3f]/[0.08] text-[#2b4c3f] border-[#2b4c3f]/20'
                                            : activity.status === 'GRADING'
                                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                                            : 'bg-[#faf9f6] text-[#a8a29e] border-[#e7e5e0]'
                                    }`}>
                                        {activity.status === 'GRADING' && (
                                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                                        )}
                                        {activity.status}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="px-4 sm:px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <motion.button
                                            whileHover={activity.status === 'GRADING' ? {} : { scale: 1.08 }}
                                            whileTap={activity.status === 'GRADING' ? {} : { scale: 0.93 }}
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                if (activity.status === 'GRADING') {
                                                    toast.error("Evaluation is in progress. Please wait for the report to compile.");
                                                } else {
                                                    onViewResults(activity.id); 
                                                }
                                            }}
                                            title={activity.status === 'GRADING' ? "Evaluation In Progress" : "View Results"}
                                            className={`p-1.5 rounded-lg transition-all duration-200 ${
                                                activity.status === 'GRADING'
                                                    ? 'bg-amber-50 text-amber-500 border border-amber-200 cursor-not-allowed'
                                                    : 'bg-[#2b4c3f]/[0.08] text-[#2b4c3f] hover:bg-[#2b4c3f] hover:text-white'
                                            }`}
                                        >
                                            <BarChart3 className="w-4 h-4" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.08 }}
                                            whileTap={{ scale: 0.93 }}
                                            onClick={(e) => { e.stopPropagation(); onDelete(activity.id); }}
                                            title="Delete Session"
                                            className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}

export default RecentActivityTable;
