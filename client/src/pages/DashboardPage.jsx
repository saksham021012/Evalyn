import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/layout/Sidebar';
import DashboardTopBar from '../components/dashboard/DashboardTopBar';
import StatsCards from '../components/dashboard/StatsCards';
import ResumeActivityCard from '../components/dashboard/ResumeActivityCard';
import RecentActivityTable from '../components/dashboard/RecentActivityTable';
import EmptyDashboardState from '../components/dashboard/EmptyDashboardState';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import { getUserInterviews, deleteInterview } from '../services/operations/interviewAPI';
import { calculateDashboardStats, formatRecentActivity, getResumeActivityStatus } from '../utils/dashboardUtils';

function DashboardPage() {
    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [interviews, setInterviews] = useState([]);

    const stats = useMemo(() => calculateDashboardStats(interviews), [interviews]);
    const recentActivity = useMemo(() => formatRecentActivity(interviews, user), [interviews, user]);
    const resumeActivity = useMemo(() => getResumeActivityStatus(interviews, user), [interviews, user]);

    const fetchData = async () => {
        if (!token || !user) return;

        setLoading(true);
        try {
            const interviewsData = await dispatch(getUserInterviews(user.id));
            setInterviews(interviewsData || []);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [dispatch, token, user]);

    // Local background polling for any 'grading' sessions
    useEffect(() => {
        if (!user?.id || interviews.length === 0) return;

        const hasGradingSession = interviews.some(i => i.status === 'grading');

        if (hasGradingSession) {
            const pollInterval = setInterval(async () => {
                try {
                    // Fetch list in background without showing global loading skeleton
                    const interviewsData = await dispatch(getUserInterviews(user.id));
                    const updatedList = interviewsData || [];
                    
                    const isStillGrading = updatedList.some(i => i.status === 'grading');
                    setInterviews(updatedList);

                    if (!isStillGrading) {
                        clearInterval(pollInterval);
                        toast.success("Your report is ready! Click View Results to read it.", { duration: 5000 });
                    }
                } catch (pollErr) {
                    console.error("Dashboard background poll failed:", pollErr);
                }
            }, 5000);

            return () => clearInterval(pollInterval);
        }
    }, [interviews, dispatch, user?.id]);

    const handleDelete = async (sessionId) => {
        if (window.confirm('Are you sure you want to delete this session? This will remove all associated results and videos.')) {
            const success = await dispatch(deleteInterview(sessionId));
            if (success) {
                fetchData();
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f5f4f0]" style={{
            backgroundImage: 'linear-gradient(to right, rgba(28,25,23,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(28,25,23,0.03) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
        }}>
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <DashboardTopBar />

                {loading ? (
                    <DashboardSkeleton />
                ) : (
                    <div className="flex-1 p-4 sm:p-6 lg:p-8">
                        <StatsCards stats={stats} />
                        <ResumeActivityCard resumeActivity={resumeActivity} />
                        {recentActivity.length > 0 ? (
                            <RecentActivityTable
                                recentActivity={recentActivity}
                                onDelete={handleDelete}
                                onViewResults={(id) => navigate(`/interview/results/${id}`)}
                            />
                        ) : (
                            <EmptyDashboardState />
                        )}

                        <div className="text-center mt-10 pb-2">
                            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#a8a29e]">
                                EVALYN © 2025 • PROFESSIONAL EDITION
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DashboardPage;
