import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SetupNavbar from '../components/layout/SetupNavbar';
import ResumeUpload from '../components/session/ResumeUpload';
import RoleSelector from '../components/session/RoleSelector';
import DifficultySelector from '../components/session/DifficultySelector';

function NewInterviewPage() {
    const navigate = useNavigate();
    const [resumeFile, setResumeFile] = useState(null);
    const [targetRole, setTargetRole] = useState('');
    const [difficulty, setDifficulty] = useState('medium');
    const [isParsing, setIsParsing] = useState(false);

    const handleStartInterview = () => {
        if (!resumeFile || !targetRole) {
            alert('Please upload resume and select target role');
            return;
        }
        // TODO: Upload resume and start interview
        console.log({ resumeFile, targetRole, difficulty });
        navigate('/interview');
    };

    return (
        <div className="min-h-screen bg-black">
            <SetupNavbar />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Setup Your Session</h1>
                    <p className="text-sm sm:text-base text-gray-400">Configure your technical interview parameters.</p>
                </div>

                {/* Setup Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8"
                >
                    <ResumeUpload
                        resumeFile={resumeFile}
                        setResumeFile={setResumeFile}
                        isParsing={isParsing}
                        setIsParsing={setIsParsing}
                    />
                    <RoleSelector targetRole={targetRole} setTargetRole={setTargetRole} />
                    <DifficultySelector difficulty={difficulty} setDifficulty={setDifficulty} />

                    {/* Start Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleStartInterview}
                        disabled={!resumeFile || !targetRole}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-medium text-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        Start Interview
                        <span>→</span>
                    </motion.button>

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                    </div>
                    <p className="text-center text-gray-500 text-sm mt-2">READY TO INITIALIZE</p>
                </motion.div>

                {/* Footer */}
                <p className="text-center text-gray-600 text-xs mt-8">
                    YOUR DATA IS PROCESSED SECURELY BY AI • COMPLIANT WITH GLOBAL PRIVACY STANDARDS
                </p>
            </div>
        </div>
    );
}

export default NewInterviewPage;
