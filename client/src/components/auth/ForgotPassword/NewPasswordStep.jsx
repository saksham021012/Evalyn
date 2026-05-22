import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

function NewPasswordStep({ newPassword, setNewPassword, loading, onSubmit }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div>
                <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500 mb-2">
                    New Password
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2b4c3f]" />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-[#faf9f6] border border-zinc-200 rounded-xl pl-10 pr-12 py-3 text-[#1c1917] placeholder-zinc-400 focus:outline-none focus:border-[#2b4c3f] focus:ring-1 focus:ring-[#2b4c3f] transition text-sm"
                        required
                        minLength={6}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#2b4c3f] transition"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                <p className="font-mono text-[10px] text-zinc-400 mt-1.5 tracking-wide">// Must be at least 6 characters</p>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-[#2b4c3f] hover:bg-[#2b4c3f]/90 text-white py-3.5 rounded-xl font-mono text-xs tracking-widest uppercase font-bold transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {loading ? 'Resetting...' : 'Reset Password'}
            </motion.button>
        </form>
    );
}

export default NewPasswordStep;
