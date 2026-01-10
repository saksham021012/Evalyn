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
        { label: 'DASHBOARD', path: '/dashboard', icon: LayoutDashboard },
        { label: 'NEW INTERVIEW', path: '/new-session', icon: PlusSquare },
        { label: 'INTERVIEWS', path: '/interviews', icon: BarChart3 },
        { label: 'RESUME', path: '/resumes', icon: FileText }
    ];

    const handleLogout = () => {
        dispatch(logout(navigate));
        setIsMobileMenuOpen(false);
    };

    const handleNavClick = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 border border-slate-800 rounded-lg text-white hover:bg-slate-800 transition-colors"
            >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.div
                initial={false}
                animate={{
                    x: isMobileMenuOpen ? 0 : '-100%'
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="md:hidden fixed left-0 top-0 bottom-0 w-72 bg-[#0a0a0b] border-r border-[#1a1a1b] z-40 flex flex-col font-inter"
            >
                {/* Logo / Header */}
                <div className="p-6 mb-4 mt-16">
                    <div className='flex'>
                        <Link to="/" className="group" onClick={handleNavClick}>
                            <Code2 className="w-6 h-6 text-blue-500" />
                            <h1 className="text-white font-bold text-xl tracking-tighter leading-tight">
                                EVALYN
                            </h1>
                        </Link>
                    </div>

                    <p className="text-[#4a4a4b] text-[10px] font-bold tracking-[0.2em] mt-1 group-hover:text-blue-500 transition-colors">
                        SMART INTERVIEWER
                    </p>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 px-3">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={handleNavClick}
                                className={`group relative flex items-center px-4 py-3 rounded-xl mb-2 transition-all duration-300 ${isActive
                                    ? 'bg-blue-600/10 text-blue-500'
                                    : 'text-[#6a6a6b] hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active-mobile"
                                        className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <item.icon className={`w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'scale-110' : ''}`} />
                                <span className={`text-sm font-bold tracking-tight transition-transform duration-300 group-hover:translate-x-1 ${isActive ? 'translate-x-1' : ''}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full group relative flex items-center px-4 py-3 rounded-xl mb-2 transition-all duration-300 text-[#6a6a6b] hover:text-red-500 hover:bg-red-500/5"
                    >
                        <LogOut className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                        <span className="text-sm font-bold tracking-tight transition-transform duration-300 group-hover:translate-x-1">
                            LOGOUT
                        </span>
                    </button>
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-[#1a1a1b]">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-[#1a1a1b] to-transparent mb-4" />
                    <p className="text-[#3a3a3b] text-[10px] font-medium tracking-wide">
                        v2.4.0 Professional Edition
                    </p>
                </div>
            </motion.div>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:w-60 lg:w-72 bg-[#0a0a0b] border-r border-[#1a1a1b] min-h-screen flex-col font-inter">
                {/* Logo / Header */}
                <div className="p-6 lg:p-10 mb-4 lg:mb-8">
                    <div className='flex'>
                        <Link to="/" className="group">
                            <Code2 className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500" />
                            <h1 className="text-white font-bold text-lg lg:text-xl tracking-tighter leading-tight">
                                EVALYN
                            </h1>
                        </Link>
                    </div>

                    <p className="text-[#4a4a4b] text-[10px] font-bold tracking-[0.2em] mt-1 group-hover:text-blue-500 transition-colors">
                        SMART INTERVIEWER
                    </p>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 px-3 lg:px-4">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`group relative flex items-center px-4 lg:px-6 py-3 lg:py-4 rounded-xl mb-2 lg:mb-3 transition-all duration-300 ${isActive
                                    ? 'bg-blue-600/10 text-blue-500'
                                    : 'text-[#6a6a6b] hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <item.icon className={`w-4 h-4 lg:w-5 lg:h-5 mr-3 lg:mr-4 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'scale-110' : ''}`} />
                                <span className={`text-xs lg:text-sm font-bold tracking-tight transition-transform duration-300 group-hover:translate-x-1 ${isActive ? 'translate-x-1' : ''}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full group relative flex items-center px-4 lg:px-6 py-3 lg:py-4 rounded-xl mb-2 lg:mb-3 transition-all duration-300 text-[#6a6a6b] hover:text-red-500 hover:bg-red-500/5"
                    >
                        <LogOut className="w-4 h-4 lg:w-5 lg:h-5 mr-3 lg:mr-4 transition-transform duration-300 group-hover:scale-110" />
                        <span className="text-xs lg:text-sm font-bold tracking-tight transition-transform duration-300 group-hover:translate-x-1">
                            LOGOUT
                        </span>
                    </button>
                </nav>

                {/* Footer */}
                <div className="p-6 lg:p-10 border-t border-[#1a1a1b]">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-[#1a1a1b] to-transparent mb-4 lg:mb-8" />
                    <p className="text-[#3a3a3b] text-[10px] font-medium tracking-wide">
                        v2.4.0 Professional Edition
                    </p>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
