import { motion } from 'framer-motion';

function LoadingSpinner({ message = 'Loading...', fullScreen = true }) {
    return (
        <div className={`flex flex-col items-center justify-center ${fullScreen ? 'fixed inset-0 z-50 bg-[#f5f4f0]' : 'w-full py-12'}`}>
            <div className="relative w-16 h-16 flex items-center justify-center">
                {/* Background Ring */}
                <div className="absolute inset-0 rounded-full border-[3px] border-[#e7e5e0]" />

                {/* Main Spinner Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-t-[3px] border-r-[3px] border-[#2b4c3f]"
                />

                {/* Inner pulsing dot */}
                <div className="w-3 h-3 bg-[#2b4c3f] rounded-full animate-pulse" />
            </div>

            {/* Loading Message */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 flex flex-col items-center gap-2"
            >
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#57534e] font-semibold">{message}</p>
                <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                            className="w-1 h-1 bg-[#2b4c3f] rounded-full"
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

export default LoadingSpinner;
