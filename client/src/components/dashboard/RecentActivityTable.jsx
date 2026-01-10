import { motion } from 'framer-motion';
import { Trash2, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function RecentActivityTable({ recentActivity, onDelete, onViewResults }) {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden font-inter"
        >
            <div className="p-4 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">Recent Activity</h3>
                    <span className="bg-blue-500/10 text-blue-500 text-[10px] font-black tracking-widest px-2 py-0.5 rounded">LATEST SESSIONS</span>
                </div>
                <button
                    onClick={() => navigate('/interviews')}
                    className="text-blue-500 hover:text-blue-400 transition text-sm font-bold tracking-tight"
                >
                    Full History →
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-800 bg-slate-900/30">
                            <th className="text-left text-gray-400 text-[10px] font-black tracking-widest px-3 sm:px-6 py-3 sm:py-4 uppercase">Candidate</th>
                            <th className="text-left text-gray-400 text-[10px] font-black tracking-widest px-3 sm:px-6 py-3 sm:py-4 uppercase hidden sm:table-cell">Date</th>
                            <th className="text-left text-gray-400 text-[10px] font-black tracking-widest px-3 sm:px-6 py-3 sm:py-4 uppercase hidden md:table-cell">Stack</th>
                            <th className="text-left text-gray-400 text-[10px] font-black tracking-widest px-3 sm:px-6 py-3 sm:py-4 uppercase">Score</th>
                            <th className="text-left text-gray-400 text-[10px] font-black tracking-widest px-3 sm:px-6 py-3 sm:py-4 uppercase hidden lg:table-cell">Status</th>
                            <th className="text-left text-gray-400 text-[10px] font-black tracking-widest px-3 sm:px-6 py-3 sm:py-4 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentActivity.map((activity, index) => (
                            <motion.tr
                                key={activity.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                                className="border-b border-slate-800/50 hover:bg-white/[0.02] transition group cursor-pointer"
                                onClick={() => onViewResults(activity.id)}
                            >
                                <td className="px-3 sm:px-6 py-4 sm:py-5">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                                            <span className="text-white text-xs font-black">{activity.avatar}</span>
                                        </div>
                                        <span className="text-white font-semibold text-xs sm:text-sm tracking-tight">{activity.candidate}</span>
                                    </div>
                                </td>
                                <td className="px-3 sm:px-6 py-4 sm:py-5 text-gray-400 text-xs sm:text-sm font-medium hidden sm:table-cell">{activity.date}</td>
                                <td className="px-3 sm:px-6 py-4 sm:py-5 hidden md:table-cell">
                                    <div className="flex gap-2">
                                        {activity.stack.map((tech, i) => (
                                            <span key={i} className="bg-slate-800 text-gray-300 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-tight">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-3 sm:px-6 py-4 sm:py-5">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="flex-1 min-w-[40px] sm:min-w-[60px] max-w-[80px] sm:max-w-[100px] bg-slate-800 rounded-full h-1">
                                            <div
                                                className="bg-blue-500 h-1 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                                style={{ width: `${activity.score}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-white font-bold text-xs sm:text-sm tracking-tighter">{activity.score}/100</span>
                                    </div>
                                </td>
                                <td className="px-3 sm:px-6 py-4 sm:py-5 hidden lg:table-cell">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase border ${activity.status === 'COMPLETED'
                                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                        : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                        }`}>
                                        {activity.status}
                                    </span>
                                </td>
                                <td className="px-3 sm:px-6 py-4 sm:py-5">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onViewResults(activity.id);
                                            }}
                                            className="p-1.5 bg-blue-500/10 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-all duration-300"
                                            title="View Results"
                                        >
                                            <BarChart3 className="w-4 h-4" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(activity.id);
                                            }}
                                            className="p-1.5 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all duration-300"
                                            title="Delete Session"
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

