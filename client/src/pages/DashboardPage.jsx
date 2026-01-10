import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import DashboardTopBar from '../components/dashboard/DashboardTopBar';
import StatsCards from '../components/dashboard/StatsCards';
import ResumeActivityCard from '../components/dashboard/ResumeActivityCard';
import RecentActivityTable from '../components/dashboard/RecentActivityTable';
import EmptyDashboardState from '../components/dashboard/EmptyDashboardState';
import { getUserInterviews, deleteInterview } from '../services/operations/interviewAPI';
import LoadingSpinner from '../components/common/LoadingSpinner';
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

    const handleDelete = async (sessionId) => {
        if (window.confirm('Are you sure you want to delete this session? This will remove all associated results and videos.')) {
            const success = await dispatch(deleteInterview(sessionId));
            if (success) {
                fetchData();
            }
        }
    };

    if (loading) {
        return <LoadingSpinner message="Preparing your dashboard" />;
    }

    return (
        <div className="flex min-h-screen bg-black">
            <Sidebar />

            <div className="flex-1">
                <DashboardTopBar />

                <div className="p-4 sm:p-6 lg:p-8">
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

                    <div className="text-center mt-8">
                        <p className="text-gray-500 text-xs sm:text-sm">EVALYN © 2025 • PROFESSIONAL EDITION</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
