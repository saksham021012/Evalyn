import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function ResumeActivityCard({ resumeActivity }) {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-gradient-to-br from-blue-900/20 to-blue-950/20 border border-blue-800/30 rounded-xl p-8 mb-8"
        >
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className={`w-2 h-2 ${resumeActivity.status === 'in-progress' ? 'bg-green-500 animate-pulse' : 'bg-blue-500'} rounded-full`}></div>
                        <p className={`${resumeActivity.status === 'in-progress' ? 'text-green-400' : 'text-blue-400'} text-sm font-medium uppercase`}>
                            {resumeActivity.status === 'in-progress' ? 'Active Session' : 'Ready to Start'}
                        </p>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        <span className="text-blue-400 capitalize">{resumeActivity.role}</span>
                    </h2>
                    <p className="text-gray-400 leading-relaxed">
                        You are {resumeActivity.phase}. Take the next step to advance your career.
                    </p>
                </div>

                <button
                    onClick={() => navigate(resumeActivity.status === 'in-progress' ? '/interview' : '/new-session')}
                    className={`${resumeActivity.status === 'in-progress' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-8 py-3 rounded-lg font-medium transition flex items-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98]`}
                >
                    {resumeActivity.status === 'in-progress' ? 'Resume Interview' : 'Start New Session'}
                    <span className="text-lg">→</span>
                </button>
            </div>
        </motion.div>
    );
}

export default ResumeActivityCard;
