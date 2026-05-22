import { Link, useNavigate } from 'react-router-dom';
import { Code2, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../services/operations/authAPI';
import { useState, useRef, useEffect } from 'react';

function Navbar() {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const dispatch = useDispatch();
    const navigate = useNavigate();
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

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 bg-[#f5f4f0]/85 backdrop-blur-md border-b border-zinc-200/80"
        >
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 text-zinc-900 font-bold text-xl font-serif">
                        <div className="bg-[#2b4c3f] p-1.5 rounded-lg flex items-center justify-center text-white">
                            <Code2 className="w-4.5 h-4.5" />
                        </div>
                        <span className="tracking-tight text-[#1c1917]">Evalyn</span>
                    </Link>
 
                    {/* Nav Links */}
                    <div className="hidden md:flex ml-20 items-center gap-8">
                        <a href="#learn-more" className="text-zinc-600 hover:text-[#2b4c3f] font-sans font-medium text-[14px] transition">
                            Learn More
                        </a>
                        <a href="#how-it-works" className="text-zinc-600 hover:text-[#2b4c3f] font-sans font-medium text-[14px] transition">
                            How it Works
                        </a>
                        <a className="text-zinc-600 hover:text-[#2b4c3f] font-sans font-medium text-[14px] transition cursor-pointer">
                            Contact Us
                        </a>
                    </div>
 
                    {/* Auth Buttons / User Avatar */}
                    {token && user ? (
                        <div className="relative" ref={dropdownRef}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 bg-white hover:bg-zinc-50 border border-zinc-200 shadow-sm px-3 py-2 rounded-lg transition"
                            >
                                <div className="w-8 h-8 bg-[#2b4c3f] rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        {getInitials(user.name)}
                                    </span>
                                </div>
                                <span className="text-zinc-800 font-medium hidden md:block text-sm">
                                    {user.name}
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
                                        className="absolute right-0 mt-2 w-64 bg-white border border-zinc-200 rounded-lg shadow-xl overflow-hidden"
                                    >
                                        {/* User Info */}
                                        <div className="px-4 py-3 border-b border-zinc-200 bg-zinc-50/50">
                                            <p className="text-zinc-900 font-medium text-sm">{user.name}</p>
                                            <p className="text-zinc-500 text-xs truncate">{user.email}</p>
                                        </div>
 
                                        {/* Menu Items */}
                                        <div className="py-1">
                                            <Link
                                                to="/dashboard"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition text-sm"
                                            >
                                                <LayoutDashboard className="w-4 h-4 text-zinc-400" />
                                                <span>Dashboard</span>
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition text-sm"
                                            >
                                                <LogOut className="w-4 h-4 text-zinc-400" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="text-zinc-600 hover:text-zinc-900 transition px-4 py-2 font-medium text-[14px]"
                            >
                                Login
                            </Link>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Link
                                    to="/signup"
                                    className="bg-white hover:bg-zinc-50 text-zinc-800 px-6 py-2 rounded-lg border border-zinc-200 shadow-sm transition font-medium text-sm"
                                >
                                    Get Started
                                </Link>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </motion.nav>
    );
}

export default Navbar;
