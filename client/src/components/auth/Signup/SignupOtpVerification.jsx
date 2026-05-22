import { motion } from 'framer-motion';

function SignupOtpVerification({ otp, setOtp, onVerify, onResend, onBack, loading }) {
    return (
        <form onSubmit={onVerify} className="space-y-5">
            {/* OTP Input */}
            <div>
                <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500 mb-2">
                    Verification Code
                </label>
                <input
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full bg-[#faf9f6] border border-zinc-200 rounded-xl px-4 py-3.5 text-[#1c1917] text-center text-2xl tracking-[0.5em] placeholder-zinc-300 focus:outline-none focus:border-[#2b4c3f] focus:ring-1 focus:ring-[#2b4c3f] transition font-mono"
                    required
                    maxLength={6}
                />
                <p className="font-mono text-[10px] text-zinc-400 mt-1.5 tracking-wide text-center">// Enter the 6-digit code from your email</p>
            </div>

            {/* Verify Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-[#2b4c3f] hover:bg-[#2b4c3f]/90 text-white py-3.5 rounded-xl font-mono text-xs tracking-widest uppercase font-bold transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Verifying...' : 'Verify Email'}
            </motion.button>

            {/* Resend OTP */}
            <div className="text-center">
                <button
                    type="button"
                    onClick={onResend}
                    disabled={loading}
                    className="text-[#2b4c3f] hover:underline transition text-sm font-sans font-semibold disabled:opacity-50"
                >
                    Resend Code
                </button>
            </div>

            {/* Back Button */}
            <button
                type="button"
                onClick={onBack}
                className="w-full text-center font-mono text-[10px] tracking-widest uppercase text-zinc-400 hover:text-[#2b4c3f] transition"
            >
                ← Back to signup
            </button>
        </form>
    );
}

export default SignupOtpVerification;
