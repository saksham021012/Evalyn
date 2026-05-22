import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import { login } from '../services';
import LoginForm from '../components/auth/Login/LoginForm';

function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(login(formData.email, formData.password, navigate));
    };

    return (
        <div className="min-h-screen bg-grid-pattern flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Logo */}
            <Link to="/" className="absolute top-5 left-6 flex items-center gap-2.5 text-[#1c1917] font-bold text-xl font-serif">
                <div className="bg-[#2b4c3f] p-1.5 rounded-lg flex items-center justify-center text-white">
                    <Code2 className="w-4 h-4" />
                </div>
                <span className="tracking-tight hidden sm:inline">Evalyn</span>
            </Link>

            {/* Support Button */}
            <button className="absolute top-4 sm:top-5 right-6 bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 shadow-sm px-5 py-2 text-xs font-mono tracking-widest uppercase font-bold transition rounded-xl">
                Support
            </button>

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md mt-12 sm:mt-0"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="w-1.5 h-1.5 bg-[#2b4c3f] rounded-full"></span>
                        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-500">
                            Secure Access
                        </span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#1c1917] mb-2 font-serif tracking-tight">
                        Welcome back
                    </h1>
                    <p className="text-sm text-zinc-500 font-sans">
                        Log in to your account to continue
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white/90 backdrop-blur-md border border-zinc-200 shadow-sm rounded-xl p-6 sm:p-8">
                    <LoginForm
                        formData={formData}
                        setFormData={setFormData}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        onSubmit={handleSubmit}
                        loading={loading}
                    />
                </div>
            </motion.div>
        </div>
    );
}

export default LoginPage;
