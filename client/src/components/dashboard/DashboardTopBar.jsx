import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown, LayoutDashboard, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../services/operations/authAPI';
import { useState, useRef, useEffect } from 'react';

function DashboardTopBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.profile);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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
        return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="bg-[#faf9f6]/90 backdrop-blur-md border-b border-[#e7e5e0] px-6 lg:px-8 py-4 sticky top-0 z-30">
            <div className="flex items-center justify-between">

                {/* Left: Title + breadcrumb */}
                <div>
                    <h1 className="font-serif text-[22px] font-bold text-[#1c1917] leading-tight tracking-tight">
                        Dashboard
                    </h1>
                    <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#a8a29e] mt-0.5">
                        Overview / Session Analytics
                    </p>
                </div>

                {/* Right: CTA + User */}
                <div className="flex items-center gap-3">

                    {/* Start New Interview */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/new-session')}
                        className="hidden sm:flex items-center gap-2 bg-[#2b4c3f] hover:bg-[#2b4c3f]/90 text-white px-5 py-2.5 rounded-xl font-mono text-[10px] tracking-[0.2em] uppercase font-bold transition shadow-sm"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        New Interview
                    </motion.button>

                    {/* User Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2.5 bg-white hover:bg-[#f5f4f0] border border-[#e7e5e0] px-3 py-2 rounded-xl transition shadow-sm"
                        >
                            <div className="w-7 h-7 bg-[#2b4c3f] rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-xs">{getInitials(user?.name)}</span>
                            </div>
                            <span className="text-[#1c1917] font-medium text-sm hidden md:block">
                                {user?.name?.split(' ')[0]}
                            </span>
                            <ChevronDown className={`w-3.5 h-3.5 text-[#a8a29e] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </motion.button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-2 w-60 bg-white border border-[#e7e5e0] rounded-xl shadow-md overflow-hidden z-50"
                                >
                                    {/* User Info */}
                                    <div className="px-4 py-3 border-b border-[#e7e5e0] bg-[#faf9f6]">
                                        <p className="text-[#1c1917] font-semibold text-sm">{user?.name}</p>
                                        <p className="text-[#a8a29e] text-xs truncate font-mono mt-0.5">{user?.email}</p>
                                    </div>

                                    <div className="py-1.5">
                                        <button
                                            onClick={() => { setIsDropdownOpen(false); navigate('/dashboard'); }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-[#57534e] hover:bg-[#f5f4f0] hover:text-[#1c1917] transition text-sm"
                                        >
                                            <LayoutDashboard className="w-4 h-4 text-[#a8a29e]" />
                                            <span>Dashboard</span>
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-[#57534e] hover:bg-red-50 hover:text-red-600 transition text-sm"
                                        >
                                            <LogOut className="w-4 h-4 text-[#a8a29e]" />
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

export default DashboardTopBar;
