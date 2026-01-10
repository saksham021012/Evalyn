import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

function LoginForm({ formData, setFormData, showPassword, setShowPassword, onSubmit, loading }) {
    return (
        <form onSubmit={onSubmit} className="space-y-5">
            {/* Email */}
            <div>
                <label className="block text-gray-400 text-sm mb-2">
                    EMAIL ADDRESS
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="email"
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                        required
                    />
                </div>
            </div>

            {/* Password */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-gray-400 text-sm">PASSWORD</label>
                    <Link to="/forgot-password" className="text-blue-500 text-sm hover:text-blue-400 transition">
                        Forgot Password?
                    </Link>
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400 transition"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Submit Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>

            {/* Signup Link */}
            <p className="text-center text-gray-400 text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-500 hover:text-blue-400 transition font-medium">
                    Create Account
                </Link>
            </p>
        </form>
    );
}

export default LoginForm;
