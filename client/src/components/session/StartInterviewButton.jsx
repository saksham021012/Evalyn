import { motion } from 'framer-motion';

function StartInterviewButton({ onClick, disabled, loading }) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            disabled={disabled || loading}
            className="w-full bg-[#2b4c3f] hover:bg-[#2b4c3f]/90 text-white py-4 rounded-xl font-mono text-[11px] tracking-[0.2em] font-bold uppercase transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
        >
            {loading ? 'Initializing Session...' : 'Start Interview'}
            {!loading && <span>→</span>}
        </motion.button>
    );
}

export default StartInterviewButton;
