import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, PlusSquare, BarChart3, FileText, LogOut, Code2, Menu, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../services/operations/authAPI';

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'New Interview', path: '/new-session', icon: PlusSquare },
        { label: 'Interviews', path: '/interviews', icon: BarChart3 },
        { label: 'Resume', path: '/resumes', icon: FileText }
    ];

    const handleLogout = () => {
        dispatch(logout(navigate));
        setIsMobileMenuOpen(false);
    };

    const handleNavClick = () => {
        setIsMobileMenuOpen(false);
    };

    const SidebarContent = ({ isMobile = false }) => (
        <div className={`flex flex-col h-full bg-[#faf9f6] border-r border-[#e7e5e0] ${isMobile ? 'pt-16' : ''}`}>
            {/* Logo */}
            <div className="px-6 py-7">
                <Link to="/" onClick={handleNavClick} className="flex items-center gap-2.5">
                    <div className="bg-[#2b4c3f] p-1.5 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                        <Code2 className="w-4 h-4" />
                    </div>
                    <span className="font-serif font-bold text-xl text-[#1c1917] tracking-tight">Evalyn</span>
                </Link>
                <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#a8a29e] mt-1.5 ml-0.5">
                </p>
            </div>

            {/* Divider */}
            <div className="mx-4 h-px bg-[#e7e5e0] mb-3" />

            {/* Menu Items */}
            <nav className="flex-1 px-3 space-y-0.5">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={handleNavClick}
                            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                                    ? 'bg-[#2b4c3f]/[0.08] text-[#2b4c3f]'
                                    : 'text-[#57534e] hover:bg-[#f0ede8] hover:text-[#1c1917]'
                                }`}
                        >
                            {/* Active left border accent */}
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active-indicator"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#2b4c3f] rounded-r-full"
                                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                />
                            )}
                            <item.icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${isActive ? 'text-[#2b4c3f]' : 'text-[#a8a29e] group-hover:text-[#57534e]'}`} />
                            <span className={`text-sm transition-colors ${isActive ? 'font-semibold text-[#2b4c3f]' : 'font-medium'}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div className="px-3 pb-6 pt-3 border-t border-[#e7e5e0] mt-3">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-[#a8a29e] hover:bg-red-50 hover:text-red-600 group"
                >
                    <LogOut className="w-[18px] h-[18px] flex-shrink-0 group-hover:text-red-500" />
                    <span className="text-sm font-medium">Logout</span>
                </button>
                <p className="font-mono text-[9px] tracking-widest uppercase text-[#c4bfb8] mt-4 px-3">
                    v2.4.0 Professional
                </p>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Hamburger */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-[#e7e5e0] rounded-lg text-[#57534e] hover:bg-[#f5f4f0] transition shadow-sm"
            >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden fixed inset-0 bg-[#1c1917]/30 backdrop-blur-sm z-40"
                    />
                )}
            </AnimatePresence>

            {/* Mobile Sidebar */}
            <motion.div
                initial={false}
                animate={{ x: isMobileMenuOpen ? 0 : '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="md:hidden fixed left-0 top-0 bottom-0 w-64 z-40 shadow-lg"
            >
                <SidebarContent isMobile />
            </motion.div>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:w-56 lg:w-60 min-h-screen flex-col flex-shrink-0">
                <SidebarContent />
            </div>
        </>
    );
}

export default Sidebar;
