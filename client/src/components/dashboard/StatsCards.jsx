import { motion } from 'framer-motion';

function StatsCards({ stats }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {/* Hero Card — Large dark green proficiency */}
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#2b4c3f] rounded-xl p-6 shadow-sm flex flex-col justify-between min-h-[140px]"
            >
                <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/60 mb-3">
                    Overall Proficiency
                </p>
                <div>
                    <p className="text-[52px] font-bold text-white leading-none tracking-tight mb-2">
                        {stats.overallProficiency}%
                    </p>
                    <div className="flex items-center gap-3 text-white/70">
                        {stats.proficiencyChange !== 0 && (
                            <span className="font-mono text-[11px] font-semibold text-white/80">
                                {stats.proficiencyChange > 0 ? '+' : ''}{stats.proficiencyChange}% this week
                            </span>
                        )}
                        <span className="font-mono text-[11px] text-white/50">
                            {stats.totalSessions} sessions
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Secondary card — Avg tech score */}
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.08 }}
                className="bg-white border border-[#e7e5e0] rounded-xl p-6 shadow-sm flex flex-col justify-between min-h-[140px]"
            >
                <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#a8a29e] mb-3">
                    Avg Tech Score
                </p>
                <div>
                    <div className="flex items-baseline gap-1 mb-2">
                        <p className="text-[52px] font-bold text-[#1c1917] leading-none tracking-tight">
                            {stats.avgTechScore}
                        </p>
                        <span className="text-[18px] font-medium text-[#a8a29e] mb-1">/100</span>
                    </div>
                    <p className="font-mono text-[11px] text-[#a8a29e]">No change from last</p>
                </div>
            </motion.div>

            {/* Third card — Top Skill */}
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.16 }}
                className="bg-white border border-[#e7e5e0] rounded-xl p-6 shadow-sm flex flex-col justify-between min-h-[140px]"
            >
                <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#a8a29e] mb-3">
                    Top Skill
                </p>
                <div>
                    <p className="text-[32px] font-bold text-[#1c1917] leading-tight tracking-tight mb-2 line-clamp-2">
                        {stats.topSkill || '—'}
                    </p>
                </div>
            </motion.div>

            {/* Fourth card — Total Sessions */}
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.24 }}
                className="bg-white border border-[#e7e5e0] rounded-xl p-6 shadow-sm flex flex-col justify-between min-h-[140px]"
            >
                <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#a8a29e] mb-3">
                    Total Sessions
                </p>
                <div>
                    <p className="text-[52px] font-bold text-[#1c1917] leading-none tracking-tight mb-2">
                        {stats.totalSessions?.toLocaleString() ?? '0'}
                    </p>
                    <p className="font-mono text-[11px] text-[#a8a29e]">Completed interviews</p>
                </div>
            </motion.div>
        </div>
    );
}

export default StatsCards;
