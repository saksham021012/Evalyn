import { motion } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';

function HistoryHeader({ searchTerm, setSearchTerm, roleFilter, setRoleFilter, roles }) {
    return (
        <div className="flex flex-col gap-6 sm:gap-8 mb-8">
            <div className="space-y-3">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#1c1917] tracking-tight leading-tight"
                >
                    Interview History
                </motion.h1>
                <p className="text-[#57534e] text-sm sm:text-base max-w-xl leading-relaxed">
                    Review and analyze your past technical assessment sessions and performance metrics.
                </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative group flex-1 sm:flex-initial">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a8a29e] group-focus-within:text-[#2b4c3f] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search interviews..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white border border-[#e7e5e0] rounded-xl pl-11 pr-4 py-3 text-sm text-[#1c1917] placeholder-[#a8a29e] w-full sm:w-64 lg:w-80 focus:outline-none focus:border-[#2b4c3f] transition-all shadow-sm"
                    />
                </div>

                <div className="relative">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="appearance-none bg-white border border-[#e7e5e0] rounded-xl px-4 py-3 text-sm text-[#1c1917] w-full sm:w-48 focus:outline-none focus:border-[#2b4c3f] transition-all cursor-pointer font-mono font-bold uppercase tracking-widest pr-10 shadow-sm"
                    >
                        {roles.map(role => (
                            <option key={role} value={role}>{role === 'All' ? 'Filter By Role' : role}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a8a29e] pointer-events-none" />
                </div>
            </div>
        </div>
    );
}

export default HistoryHeader;
