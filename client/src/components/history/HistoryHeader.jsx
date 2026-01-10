import { motion } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';

function HistoryHeader({ searchTerm, setSearchTerm, roleFilter, setRoleFilter, roles }) {
    return (
        <div className="flex flex-col gap-6 sm:gap-8 mb-8 sm:mb-12 lg:mb-16">
            <div className="space-y-3 sm:space-y-4">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl sm:text-4xl lg:text-6xl font-black text-white tracking-tighter"
                >
                    Interview History
                </motion.h1>
                <p className="text-[#6a6a6b] text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed">
                    Review and analyze your past technical assessment sessions and performance metrics.
                </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <div className="relative group flex-1 sm:flex-initial">
                    <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4a4b] group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search interviews..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-[#0f0f10] border border-[#1a1a1b] rounded-xl pl-10 sm:pl-12 pr-4 sm:pr-6 py-3 sm:py-4 text-sm sm:text-base text-white placeholder-[#3a3a3b] w-full sm:w-64 lg:w-80 focus:outline-none focus:border-blue-500/50 focus:bg-[#151516] transition-all"
                    />
                </div>

                <div className="relative">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="appearance-none bg-[#0f0f10] border border-[#1a1a1b] rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-white w-full sm:w-48 focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer font-bold tracking-tight pr-10 sm:pr-12"
                    >
                        {roles.map(role => (
                            <option key={role} value={role}>{role === 'All' ? 'Filter By Role' : role}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4a4b] pointer-events-none" />
                </div>
            </div>
        </div>
    );
}

export default HistoryHeader;
