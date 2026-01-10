import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../components/layout/Sidebar';
import UploadResumeModal from '../components/resumes/UploadResumeModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ResumeHeader from '../components/resumes/ResumeHeader';
import ResumeCard from '../components/resumes/ResumeCard';
import EmptyResumeState from '../components/resumes/EmptyResumeState';
import ResumeInventory from '../components/resumes/ResumeInventory';
import ActiveResumeNotice from '../components/resumes/ActiveResumeNotice';
import { getUserResumes, setActiveResume, deleteResume, downloadResume } from '../services/operations/resumeAPI';

function ResumesPage() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.profile);

    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [maxSlots] = useState(10);

    const fetchResumes = async () => {
        if (!user?.id) return;
        setLoading(true);
        const data = await dispatch(getUserResumes(user.id));
        setResumes(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchResumes();
    }, [user?.id, dispatch]);

    const handleSetActive = async (id) => {
        const success = await dispatch(setActiveResume(id));
        if (success) {
            fetchResumes();
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
            const success = await dispatch(deleteResume(id));
            if (success) {
                fetchResumes();
            }
        }
    };

    const handleDownload = (id, fileName) => {
        dispatch(downloadResume(id, fileName));
    };

    return (
        <div className="flex min-h-screen bg-black">
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
                    <div className="max-w-6xl mx-auto">
                        <ResumeHeader
                            resumesCount={resumes.length}
                            maxSlots={maxSlots}
                            onUpload={() => setIsModalOpen(true)}
                        />

                        {/* Resume List */}
                        <div className="space-y-4 mb-12">
                            {loading ? (
                                <LoadingSpinner message="Fetching your inventory" fullScreen={false} />
                            ) : resumes.length > 0 ? (
                                resumes.map((resume, index) => (
                                    <ResumeCard
                                        key={resume._id}
                                        resume={resume}
                                        index={index}
                                        onSetActive={handleSetActive}
                                        onDownload={handleDownload}
                                        onDelete={handleDelete}
                                    />
                                ))
                            ) : (
                                <EmptyResumeState onUpload={() => setIsModalOpen(true)} />
                            )}
                        </div>

                        <ResumeInventory used={resumes.length} max={maxSlots} />
                        <ActiveResumeNotice />
                    </div>
                </div>
            </div>

            <UploadResumeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchResumes}
            />
        </div>
    );
}

export default ResumesPage;
