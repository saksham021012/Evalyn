import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function EmailStep({ email, setEmail, loading, onSendOtp }) {
    return (
        <form onSubmit={onSendOtp} className="space-y-5">
            <div>
                <label className="block text-gray-400 text-sm mb-2 font-bold tracking-wide">
                    EMAIL ADDRESS
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                        required
                    />
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
            >
                {loading ? 'Sending Code...' : 'Send Verification Code'}
            </motion.button>

            <Link to="/login" className="block text-center text-gray-400 hover:text-white transition text-sm">
                ← Back to Login
            </Link>
        </form>
    );
}

export default EmailStep;
