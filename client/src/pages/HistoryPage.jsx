import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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
        <div className="flex min-h-screen bg-[#050506] font-inter">
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
