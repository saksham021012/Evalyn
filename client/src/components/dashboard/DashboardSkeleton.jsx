import { motion } from 'framer-motion';

function DashboardSkeleton() {
    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 w-full animate-pulse">
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`bg-white border border-[#e7e5e0] rounded-xl p-6 shadow-sm flex flex-col justify-between min-h-[140px] ${i === 1 ? 'bg-[#2b4c3f]/5 border-transparent' : ''}`}>
                        <div className="w-24 h-3 bg-[#e7e5e0] rounded mb-3" />
                        <div>
                            <div className="w-16 h-10 bg-[#e7e5e0] rounded mb-3" />
                            <div className="w-32 h-3 bg-[#e7e5e0] rounded" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Resume Activity Card Skeleton */}
            <div className="bg-white border border-[#e7e5e0] rounded-xl p-6 mb-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-[#e7e5e0]" />
                            <div className="w-20 h-3 bg-[#e7e5e0] rounded" />
                        </div>
                        <div className="w-48 h-6 bg-[#e7e5e0] rounded mb-2" />
                        <div className="w-64 h-4 bg-[#e7e5e0] rounded" />
                    </div>
                    <div className="w-40 h-10 bg-[#e7e5e0] rounded-xl flex-shrink-0" />
                </div>
            </div>

            {/* Recent Activity Table Skeleton */}
            <div className="bg-white border border-[#e7e5e0] rounded-xl overflow-hidden shadow-sm">
                <div className="px-5 sm:px-6 py-4 border-b border-[#e7e5e0] bg-[#faf9f6] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-32 h-5 bg-[#e7e5e0] rounded" />
                        <div className="w-20 h-4 bg-[#e7e5e0] rounded-md" />
                    </div>
                    <div className="w-24 h-4 bg-[#e7e5e0] rounded" />
                </div>
                <div className="p-4 sm:p-6 space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {/* Candidate */}
                            <div className="flex items-center gap-3 w-48">
                                <div className="w-8 h-8 rounded-full bg-[#e7e5e0] flex-shrink-0" />
                                <div className="w-24 h-4 bg-[#e7e5e0] rounded" />
                            </div>
                            {/* Date */}
                            <div className="w-24 h-4 bg-[#e7e5e0] rounded hidden sm:block" />
                            {/* Stack */}
                            <div className="flex gap-2 hidden md:flex">
                                <div className="w-16 h-5 bg-[#e7e5e0] rounded" />
                                <div className="w-20 h-5 bg-[#e7e5e0] rounded" />
                            </div>
                            {/* Score */}
                            <div className="w-32 h-4 bg-[#e7e5e0] rounded" />
                            {/* Actions */}
                            <div className="flex gap-2">
                                <div className="w-7 h-7 bg-[#e7e5e0] rounded-lg" />
                                <div className="w-7 h-7 bg-[#e7e5e0] rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DashboardSkeleton;
