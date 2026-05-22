import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

function LoginForm({ formData, setFormData, showPassword, setShowPassword, onSubmit, loading }) {
    return (
        <form onSubmit={onSubmit} className="space-y-5">
            {/* Email */}
            <div>
                <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500 mb-2">
                    Email Address
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2b4c3f]" />
                    <input
                        type="email"
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#faf9f6] border border-zinc-200 rounded-xl pl-10 pr-4 py-3 text-[#1c1917] placeholder-zinc-400 focus:outline-none focus:border-[#2b4c3f] focus:ring-1 focus:ring-[#2b4c3f] transition text-sm"
                        required
                    />
                </div>
            </div>

            {/* Password */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500">Password</label>
                    <Link to="/forgot-password" className="text-[#2b4c3f] text-xs font-sans font-semibold hover:underline transition">
                        Forgot Password?
                    </Link>
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2b4c3f]" />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full bg-[#faf9f6] border border-zinc-200 rounded-xl pl-10 pr-12 py-3 text-[#1c1917] placeholder-zinc-400 focus:outline-none focus:border-[#2b4c3f] focus:ring-1 focus:ring-[#2b4c3f] transition text-sm"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#2b4c3f] transition"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Submit Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-[#2b4c3f] hover:bg-[#2b4c3f]/90 text-white py-3.5 rounded-xl font-mono text-xs tracking-widest uppercase font-bold transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>

            {/* Divider */}
            <div className="relative my-1">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 font-mono text-[10px] tracking-widest uppercase text-zinc-400">or</span>
                </div>
            </div>

            {/* Signup Link */}
            <p className="text-center text-zinc-500 text-sm font-sans">
                Don't have an account?{' '}
                <Link to="/signup" className="text-[#2b4c3f] hover:underline transition font-semibold">
                    Create Account
                </Link>
            </p>
        </form>
    );
}

export default LoginForm;
