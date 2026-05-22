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
        <div className="bg-white border-b border-[#e7e5e0] px-8 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-serif text-[#1c1917] capitalize tracking-tight">
                        {getCleanRole(user?.targetRole || 'Interview')}
                    </h1>
                    <p className="text-[#57534e] text-sm">Technical Assessment Phase</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Live Indicator */}
                    <div className="flex items-center gap-2 bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg shadow-sm">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-red-600 font-mono text-[10px] tracking-[0.2em] font-bold uppercase">LIVE</span>
                    </div>

                    {/* Timer */}
                    <div className="flex items-center gap-2 bg-[#f5f4f0] px-3 py-1.5 rounded-lg border border-[#e7e5e0] shadow-sm">
                        <span className="text-[#1c1917] font-mono text-xs font-bold">{formatTime(sessionTime)}</span>
                        <span className="text-[#a8a29e] font-mono text-xs">/</span>
                        <span className="text-[#57534e] font-mono text-xs font-bold">45:00</span>
                    </div>

                    {/* End Session */}
                    <button
                        onClick={onEndSession}
                        className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-5 py-2 rounded-lg font-mono text-[10px] tracking-[0.2em] font-bold uppercase transition shadow-sm"
                    >
                        End Session
                    </button>

                    {/* User Avatar Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 bg-[#f5f4f0] hover:bg-[#e7e5e0] px-3 py-1.5 rounded-lg transition border border-[#e7e5e0] shadow-sm"
                        >
                            <div className="w-7 h-7 bg-[#2b4c3f] rounded flex items-center justify-center">
                                <span className="text-white font-bold text-xs">
                                    {getInitials(user?.name)}
                                </span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-[#a8a29e] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </motion.button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-2 w-64 bg-white border border-[#e7e5e0] rounded-xl shadow-lg overflow-hidden z-50"
                                >
                                    {/* User Info */}
                                    <div className="px-4 py-3 border-b border-[#e7e5e0] bg-[#faf9f6]">
                                        <p className="text-[#1c1917] font-semibold tracking-tight">{user?.name}</p>
                                        <p className="text-[#57534e] text-xs truncate mt-0.5">{user?.email}</p>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-2">
                                        <button
                                            onClick={() => {
                                                setIsDropdownOpen(false);
                                                navigate('/dashboard');
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-[#57534e] hover:bg-[#f5f4f0] hover:text-[#1c1917] transition text-sm font-medium"
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                            <span>Dashboard</span>
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-[#57534e] hover:bg-[#f5f4f0] hover:text-red-600 transition text-sm font-medium"
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
