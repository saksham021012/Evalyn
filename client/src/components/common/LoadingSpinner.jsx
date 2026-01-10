import { motion } from 'framer-motion';

function LoadingSpinner({ message = 'Loading...', fullScreen = true }) {
    return (
        <div className={`flex flex-col items-center justify-center ${fullScreen ? 'fixed inset-0 z-50 bg-black' : 'w-full py-12'}`}>
            <div className="relative w-20 h-20">
                {/* Background Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-slate-900 shadow-inner" />

                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-xl animate-pulse" />

                {/* Main Spinner Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-t-4 border-r-4 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                />

                {/* Secondary Orbital Ring */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-2 rounded-full border-b-2 border-l-2 border-slate-700/50"
                />

                {/* Center Point */}
                <div className="absolute inset-[45%] bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            </div>

            {/* Loading Message */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-8 flex flex-col items-center"
            >
                <p className="text-white font-bold tracking-widest uppercase text-xs mb-2">{message}</p>
                <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                            className="w-1 h-1 bg-blue-500 rounded-full"
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

export default LoadingSpinner;
