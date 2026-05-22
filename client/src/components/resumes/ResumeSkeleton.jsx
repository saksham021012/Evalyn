import { motion } from 'framer-motion';

function ResumeSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-[#e7e5e0] rounded-xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center gap-6 animate-pulse"
        >
            {/* File Icon Skeleton */}
            <div className="shrink-0 w-14 h-14 rounded-lg bg-[#f5f4f0]" />

            {/* Details Skeleton */}
            <div className="flex-1 min-w-0">
                <div className="h-5 bg-[#e7e5e0] rounded w-1/3 mb-3" />
                <div className="flex gap-3">
                    <div className="h-3 bg-[#f5f4f0] rounded w-20" />
                    <div className="h-3 bg-[#f5f4f0] rounded w-16" />
                    <div className="h-3 bg-[#f5f4f0] rounded w-24" />
                </div>
            </div>

            {/* Actions Skeleton */}
            <div className="flex items-center gap-3 lg:border-l lg:border-[#e7e5e0] lg:pl-6">
                <div className="h-8 bg-[#f5f4f0] rounded-lg w-24" />
                <div className="w-px h-6 bg-[#e7e5e0] mx-1" />
                <div className="h-8 w-8 bg-[#f5f4f0] rounded-lg" />
                <div className="h-8 w-8 bg-[#f5f4f0] rounded-lg" />
            </div>
        </motion.div>
    );
}

export default ResumeSkeleton;
