import { motion } from 'framer-motion';

function StartInterviewButton({ onClick, disabled, loading }) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            disabled={disabled || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-medium text-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {loading ? 'Initializing Session...' : 'Start Interview'}
            {!loading && <span>→</span>}
        </motion.button>
    );
}

export default StartInterviewButton;
