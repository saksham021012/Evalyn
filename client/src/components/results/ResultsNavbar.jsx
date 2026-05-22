import { Link, useNavigate } from 'react-router-dom';
import { Download, LayoutDashboard, LogOut, ChevronDown, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../services/operations/authAPI';
import { useState, useRef, useEffect } from 'react';
import { generatePDFReport } from '../../utils/pdfGenerator';

function ResultsNavbar({ onDownload }) {
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

    const handleDownloadPDF = () => {
        if (onDownload) onDownload();
    };

    return (
        <nav className="bg-[#f5f4f0]/85 backdrop-blur-md border-b border-[#e7e5e0]">
            <div className="max-w-7xl mx-auto px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo & Nav */}
                    <div className="flex items-center gap-8">
                        <Link to="/dashboard" className="flex items-center gap-2.5 text-zinc-900 font-bold text-xl font-serif">
                            <div className="bg-[#2b4c3f] p-1.5 rounded-lg flex items-center justify-center text-white">
                                <Code2 className="w-4.5 h-4.5" />
                            </div>
                            <span className="tracking-tight text-[#1c1917]">Evalyn</span>
                        </Link>

                        <div className="flex items-center gap-6">
                            <Link to="/dashboard" className="text-zinc-600 hover:text-[#2b4c3f] font-sans font-medium text-[14px] transition">
                                Dashboard
                            </Link>
                            <Link to="/interviews" className="text-zinc-600 hover:text-[#2b4c3f] font-sans font-medium text-[14px] transition">
                                Interviews
                            </Link>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center gap-2 bg-[#2b4c3f] hover:bg-[#1f382e] text-white px-4 py-2 rounded-lg transition text-sm font-sans font-medium shadow-sm"
                        >
                            <Download className="w-4 h-4" />
                            Download PDF Report
                        </button>

                        {/* User Avatar Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 bg-white hover:bg-zinc-50 border border-[#e7e5e0] shadow-sm px-3 py-2 rounded-lg transition"
                            >
                                <div className="w-8 h-8 bg-[#2b4c3f] rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        {getInitials(user?.name)}
                                    </span>
                                </div>
                                <span className="text-zinc-800 font-medium hidden md:block text-sm">
                                    {user?.name}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </motion.button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-64 bg-white border border-[#e7e5e0] rounded-lg shadow-xl overflow-hidden z-50"
                                    >
                                        {/* User Info */}
                                        <div className="px-4 py-3 border-b border-[#e7e5e0] bg-zinc-50/50">
                                            <p className="text-zinc-900 font-medium text-sm">{user?.name}</p>
                                            <p className="text-zinc-500 text-xs truncate">{user?.email}</p>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-1">
                                            <button
                                                onClick={() => {
                                                    setIsDropdownOpen(false);
                                                    navigate('/dashboard');
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition text-sm text-left"
                                            >
                                                <LayoutDashboard className="w-4 h-4 text-zinc-400" />
                                                <span>Dashboard</span>
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition text-sm text-left"
                                            >
                                                <LogOut className="w-4 h-4 text-zinc-400" />
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
        </nav>
    );
}

export default ResultsNavbar;
