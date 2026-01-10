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
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Logo */}
            <Link to="/" className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 text-white font-bold text-lg sm:text-xl">
                <Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                <span className="hidden sm:inline">Evalyn</span>
            </Link>

            {/* Support Button */}
            <button className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition">
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
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        Welcome back
                    </h1>
                    <p className="text-sm sm:text-base text-gray-400">
                        Log in to your account to continue
                    </p>
                </div>

                {/* Card */}
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8">
                    {/* Form */}
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
