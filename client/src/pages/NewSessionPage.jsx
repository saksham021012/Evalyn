import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/layout/Sidebar';
import ResumeUpload from '../components/session/ResumeUpload';
import RoleSelector from '../components/session/RoleSelector';
import DifficultySelector from '../components/session/DifficultySelector';
import SetupHeader from '../components/session/SetupHeader';
import SetupFooter from '../components/session/SetupFooter';
import StartInterviewButton from '../components/session/StartInterviewButton';
import SetupProgress from '../components/session/SetupProgress';
import { uploadResume, getUserResumes, setActiveResume, startInterview } from '../services';
import { setResumeData } from '../redux/slices/resumeSlice';

function NewSessionPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);

    const [resumeFile, setResumeFile] = useState(null);
    const [uploadedResumeData, setUploadedResumeData] = useState(null);
    const [targetRole, setTargetRole] = useState('');
    const [difficulty, setDifficulty] = useState('medium');
    const [isParsing, setIsParsing] = useState(false);
    const [resumesCount, setResumesCount] = useState(0);

    // Auto-fetch active or most recent resume
    useEffect(() => {
        const fetchRecentResume = async () => {
            if (user?.id) {
                try {
                    const resumes = await dispatch(getUserResumes(user.id));
                    setResumesCount(resumes?.length || 0);
                    if (resumes && resumes.length > 0) {
                        const activeResume = resumes.find(r => r.isActive) || resumes[0];

                        setUploadedResumeData({ resume: activeResume });
                        setTargetRole(activeResume.targetRole || '');
                        setResumeFile({
                            name: activeResume.fileName,
                            size: activeResume.fileSize,
                            isExisting: true
                        });
                        dispatch(setResumeData({ resume: activeResume }));
                    }
                } catch (error) {
                    console.error('Failed to fetch resumes:', error);
                }
            }
        };
        fetchRecentResume();
    }, [user?.id, dispatch]);

    const handleResumeUpload = async (file) => {
        if (!file) return;

        setIsParsing(true);
        try {
            const result = await dispatch(uploadResume(file, targetRole || 'Software Engineer', null));

            if (result?.resume?._id) {
                await dispatch(setActiveResume(result.resume._id));
            }

            setUploadedResumeData(result);
            setResumeFile(file);
            setResumesCount(prev => prev + 1);
        } catch (error) {
            console.error('Resume upload failed:', error);
            setResumeFile(null);
            setUploadedResumeData(null);
        } finally {
            setIsParsing(false);
        }
    };

    const handleStartInterview = async () => {
        if (!uploadedResumeData || !targetRole) {
            toast.error('Please upload a resume and select a role');
            return;
        }

        const interviewData = {
            userId: user?.id,
            resumeId: uploadedResumeData.resume._id,
            role: targetRole,
            difficulty: difficulty
        };

        dispatch(startInterview(interviewData, navigate));
    };

    const resetResume = () => {
        setResumeFile(null);
        setUploadedResumeData(null);
    };

    return (
        <div className="flex min-h-screen bg-black">
            <Sidebar />

            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
                    <SetupHeader />

                    {/* Setup Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8"
                    >
                        <ResumeUpload
                            resumeFile={resumeFile}
                            onRemove={resetResume}
                            isParsing={isParsing}
                            isLimitReached={resumesCount >= 10}
                            onFileSelect={handleResumeUpload}
                        />
                        <RoleSelector targetRole={targetRole} setTargetRole={setTargetRole} />
                        <DifficultySelector difficulty={difficulty} setDifficulty={setDifficulty} />

                        <StartInterviewButton
                            onClick={handleStartInterview}
                            disabled={!uploadedResumeData || !targetRole}
                            loading={loading}
                        />

                        <SetupProgress
                            hasResume={!!uploadedResumeData}
                            hasRole={!!targetRole}
                            hasDifficulty={!!difficulty}
                        />
                    </motion.div>

                    <SetupFooter />
                </div>
            </div>
        </div>
    );
}

export default NewSessionPage;
