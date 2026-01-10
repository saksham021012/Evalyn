import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../services/operations/authAPI';
import { useState, useRef, useEffect } from 'react';

function InterviewTopBar({ sessionTime, onEndSession }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.profile);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch(logout(navigate));
        setIsDropdownOpen(false);
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getCleanRole = (role) => {
        if (!role) return 'Technical Assessment';
        return role.replace(/^(senior|junior|lead|staff|principal|entry|associate)\s+/i, '');
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-black border-b border-slate-800 px-8 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white capitalize">
                        {getCleanRole(user?.targetRole || 'Interview')}
                    </h1>
                    <p className="text-gray-400 text-sm">Technical Assessment Phase</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Live Indicator */}
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-lg">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-red-400 text-sm font-medium">LIVE</span>
                    </div>

                    {/* Timer */}
                    <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg">
                        <span className="text-white font-mono">{formatTime(sessionTime)}</span>
                        <span className="text-gray-500">/</span>
                        <span className="text-gray-400 font-mono">45:00</span>
                    </div>

                    {/* End Session */}
                    <button
                        onClick={onEndSession}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition"
                    >
                        End Session
                    </button>

                    {/* User Avatar Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition"
                        >
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                    {getInitials(user?.name)}
                                </span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </motion.button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden z-50"
                                >
                                    {/* User Info */}
                                    <div className="px-4 py-3 border-b border-slate-800">
                                        <p className="text-white font-medium">{user?.name}</p>
                                        <p className="text-gray-400 text-sm truncate">{user?.email}</p>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-2">
                                        <button
                                            onClick={() => {
                                                setIsDropdownOpen(false);
                                                navigate('/dashboard');
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-slate-800 hover:text-white transition"
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                            <span>Dashboard</span>
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-slate-800 hover:text-white transition"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InterviewTopBar;
