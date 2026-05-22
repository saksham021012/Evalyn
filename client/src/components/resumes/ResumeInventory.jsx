import { motion } from 'framer-motion';

function ResumeInventory({ used, max }) {
    const progressPercentage = (used / max) * 100;

    return (
        <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-mono text-[9px] font-bold tracking-[0.25em] text-[#a8a29e] uppercase">
                    {used} of {max} resume slots used
                </h3>
            </div>
            <div className="w-full h-1.5 bg-[#e7e5e0] rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-[#2b4c3f] rounded-full"
                />
            </div>
        </div>
    );
}

export default ResumeInventory;
