import { useNavigate } from 'react-router-dom';

function EmptyDashboardState() {
    const navigate = useNavigate();

    return (
        <div className="bg-slate-900/50 rounded-2xl p-8 text-center border border-slate-800 mt-6">
            <p className="text-gray-400">No interview activity yet. Start a new session!</p>
            <button
                onClick={() => navigate('/new-session')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
                Start Interview
            </button>
        </div>
    );
}

export default EmptyDashboardState;
