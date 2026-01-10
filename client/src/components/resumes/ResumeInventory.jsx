import { motion } from 'framer-motion';

function ResumeInventory({ used, max }) {
    const progressPercentage = (used / max) * 100;

    return (
        <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black tracking-[0.2em] text-slate-500 uppercase">
                    {used} of {max} resume slots used
                </h3>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-blue-500 rounded-full"
                />
            </div>
        </div>
    );
}

export default ResumeInventory;
