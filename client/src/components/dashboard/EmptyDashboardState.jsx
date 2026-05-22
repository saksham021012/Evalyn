import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

function EmptyDashboardState() {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.36 }}
            className="bg-white border border-[#e7e5e0] rounded-xl p-12 shadow-sm text-center"
        >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-5">
                <span className="w-1.5 h-1.5 bg-[#2b4c3f] rounded-full" />
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#a8a29e]">
                    No Sessions Yet
                </span>
            </div>

            {/* Heading */}
            <h2 className="font-serif text-2xl font-bold text-[#1c1917] mb-3 tracking-tight">
                Your journey starts here.
            </h2>
            <p className="text-sm text-[#57534e] font-sans leading-relaxed max-w-sm mx-auto mb-8">
                Start a mock interview session to track your progress, receive AI feedback, and identify skill gaps.
            </p>

            {/* CTA */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/new-session')}
                className="inline-flex items-center gap-2 bg-[#2b4c3f] hover:bg-[#2b4c3f]/90 text-white px-7 py-3.5 rounded-xl font-mono text-[10px] tracking-[0.2em] uppercase font-bold transition shadow-sm"
            >
                Start Your First Interview
                <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
        </motion.div>
    );
}

export default EmptyDashboardState;
