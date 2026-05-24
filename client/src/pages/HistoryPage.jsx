import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/layout/Sidebar';
import { getUserInterviews, deleteInterview } from '../services/operations/interviewAPI';
import HistoryHeader from '../components/history/HistoryHeader';
import HistoryTable from '../components/history/HistoryTable';
import HistoryPagination from '../components/history/HistoryPagination';

function HistoryPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.profile);

    const [loading, setLoading] = useState(true);
    const [interviews, setInterviews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const fetchInterviews = async () => {
        if (user?.id) {
            setLoading(true);
            try {
                const data = await dispatch(getUserInterviews(user.id));
                setInterviews(data || []);
            } catch (error) {
                console.error('Failed to fetch interviews:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchInterviews();
    }, [user?.id, dispatch]);

    // Local background polling for any 'grading' sessions in History
    useEffect(() => {
        if (!user?.id || interviews.length === 0) return;

        const hasGradingSession = interviews.some(i => i.status === 'grading');

        if (hasGradingSession) {
            const pollInterval = setInterval(async () => {
                try {
                    // Fetch list in background
                    const interviewsData = await dispatch(getUserInterviews(user.id));
                    const updatedList = interviewsData || [];
                    
                    const isStillGrading = updatedList.some(i => i.status === 'grading');
                    setInterviews(updatedList);

                    if (!isStillGrading) {
                        clearInterval(pollInterval);
                        toast.success("Your report is ready! Click View Results to read it.", { duration: 5000 });
                    }
                } catch (pollErr) {
                    console.error("History background poll failed:", pollErr);
                }
            }, 5000);

            return () => clearInterval(pollInterval);
        }
    }, [interviews, dispatch, user?.id]);

    const handleDelete = async (e, sessionId) => {
        e.stopPropagation(); // Prevents row click navigation

        if (window.confirm('Are you sure you want to delete this interview session? This action cannot be undone.')) {
            const success = await dispatch(deleteInterview(sessionId));
            if (success) {
                // Refresh list
                fetchInterviews();
            }
        }
    };

    // Unique roles for filter dropdown
    const roles = ['All', ...new Set(interviews.map(i => i.role))];

    // Filtered data
    const filteredInterviews = interviews.filter(i => {
        const matchesSearch = i.role?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' || i.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    // Pagination
    const totalPages = Math.ceil(filteredInterviews.length / itemsPerPage);
    const paginatedInterviews = filteredInterviews.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="flex min-h-screen bg-[#f5f4f0]" style={{
            backgroundImage: 'linear-gradient(to right, rgba(28,25,23,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(28,25,23,0.03) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
        }}>
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-4 sm:p-6 lg:p-16 overflow-y-auto">
                <div className="max-w-7xl mx-auto">

                    <HistoryHeader
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        roleFilter={roleFilter}
                        setRoleFilter={setRoleFilter}
                        roles={roles}
                    />

                    <HistoryTable
                        interviews={paginatedInterviews}
                        loading={loading}
                        navigate={navigate}
                        onDelete={handleDelete}
                    />

                    <HistoryPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filteredInterviews.length}
                        itemsPerPage={itemsPerPage}
                    />

                </div>
            </div>
        </div>
    );
}

export default HistoryPage;
