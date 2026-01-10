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
            className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-slate-800"
        >
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
                        <Code2 className="w-6 h-6 text-blue-500" />
                        <span>Evalyn</span>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden md:flex ml-20 items-center gap-8">
                        <a href="#learn-more" className="text-gray-300 hover:text-white transition">
                            Learn More
                        </a>
                        <a href="#how-it-works" className="text-gray-300 hover:text-white transition">
                            How it Works
                        </a><a className="text-gray-300 hover:text-white transition">
                            Contact Us
                        </a>
                    </div>

                    {/* Auth Buttons / User Avatar */}
                    {token && user ? (
                        <div className="relative" ref={dropdownRef}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition"
                            >
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        {getInitials(user.name)}
                                    </span>
                                </div>
                                <span className="text-white font-medium hidden md:block">
                                    {user.name}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </motion.button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden"
                                    >
                                        {/* User Info */}
                                        <div className="px-4 py-3 border-b border-slate-800">
                                            <p className="text-white font-medium">{user.name}</p>
                                            <p className="text-gray-400 text-sm truncate">{user.email}</p>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-2">
                                            <Link
                                                to="/dashboard"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-slate-800 hover:text-white transition"
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                <span>Dashboard</span>
                                            </Link>
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
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="text-gray-300 hover:text-white transition px-4 py-2"
                            >
                                Login
                            </Link>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to="/signup"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition font-medium"
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
