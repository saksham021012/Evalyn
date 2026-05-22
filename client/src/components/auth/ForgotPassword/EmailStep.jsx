import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function EmailStep({ email, setEmail, loading, onSendOtp }) {
    return (
        <form onSubmit={onSendOtp} className="space-y-5">
            <div>
                <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500 mb-2">
                    Email Address
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2b4c3f]" />
                    <input
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#faf9f6] border border-zinc-200 rounded-xl pl-10 pr-4 py-3 text-[#1c1917] placeholder-zinc-400 focus:outline-none focus:border-[#2b4c3f] focus:ring-1 focus:ring-[#2b4c3f] transition text-sm"
                        required
                    />
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-[#2b4c3f] hover:bg-[#2b4c3f]/90 text-white py-3.5 rounded-xl font-mono text-xs tracking-widest uppercase font-bold transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Sending Code...' : 'Send Verification Code'}
            </motion.button>

            <Link
                to="/login"
                className="block text-center font-mono text-[10px] tracking-widest uppercase text-zinc-400 hover:text-[#2b4c3f] transition"
            >
                ← Back to Login
            </Link>
        </form>
    );
}

export default EmailStep;
