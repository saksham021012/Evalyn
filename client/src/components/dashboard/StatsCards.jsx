import { motion } from 'framer-motion';

function StatsCards({ stats }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Overall Proficiency */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4 sm:p-6"
            >
                <p className="text-gray-400 text-xs mb-2">OVERALL PROFICIENCY</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-3xl sm:text-4xl font-bold text-white">{stats.overallProficiency}%</p>
                    <span className="text-green-400 text-sm">+{stats.proficiencyChange}%</span>
                </div>
            </motion.div>

            {/* Avg Tech Score */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4 sm:p-6"
            >
                <p className="text-gray-400 text-xs mb-2">AVG TECH SCORE</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-3xl sm:text-4xl font-bold text-white">{stats.avgTechScore}/100</p>
                    <span className="text-gray-500 text-sm">No change</span>
                </div>
            </motion.div>

            {/* Top Skill */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4 sm:p-6"
            >
                <p className="text-gray-400 text-xs mb-2">TOP SKILL</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">{stats.topSkill}</p>
            </motion.div>

            {/* Total Sessions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4 sm:p-6"
            >
                <p className="text-gray-400 text-xs mb-2">TOTAL SESSIONS</p>
                <p className="text-3xl sm:text-4xl font-bold text-white">{stats.totalSessions.toLocaleString()}</p>
            </motion.div>
        </div>
    );
}

export default StatsCards;
