import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function ResumeActivityCard({ resumeActivity }) {
    const navigate = useNavigate();
    const isActive = resumeActivity.status === 'in-progress';

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.28 }}
            className="bg-white border border-[#e7e5e0] rounded-xl p-6 mb-5 shadow-sm"
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                {/* Left: Status + info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-[#2b4c3f] animate-pulse' : 'bg-[#a8a29e]'}`} />
                        <span className={`font-mono text-[10px] tracking-[0.2em] uppercase font-semibold ${isActive ? 'text-[#2b4c3f]' : 'text-[#a8a29e]'}`}>
                            {isActive ? 'Active Track' : 'Ready to Start'}
                        </span>
                    </div>
                    <h2 className="font-serif text-xl font-bold text-[#1c1917] mb-1.5 capitalize">
                        {resumeActivity.role}
                    </h2>
                    <p className="text-sm text-[#57534e] font-sans leading-relaxed">
                        You are {resumeActivity.phase}. Take the next step to advance your career.
                    </p>
                </div>

                {/* Right: CTA button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(isActive ? `/interview?sessionId=${resumeActivity.sessionId}` : '/new-session')}
                    className="flex items-center gap-2 bg-[#2b4c3f] hover:bg-[#2b4c3f]/90 text-white px-6 py-3 rounded-xl font-mono text-[10px] tracking-[0.2em] uppercase font-bold transition shadow-sm flex-shrink-0"
                >
                    {isActive ? 'Resume Interview' : 'Start New Session'}
                    <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
            </div>
        </motion.div>
    );
}

export default ResumeActivityCard;
