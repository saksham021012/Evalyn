import { motion } from 'framer-motion';

function SignupOtpVerification({ otp, setOtp, onVerify, onResend, onBack, loading }) {
    return (
        <form onSubmit={onVerify} className="space-y-5">
            {/* OTP Input */}
            <div>
                <label className="block text-gray-400 text-sm mb-2">
                    VERIFICATION CODE
                </label>
                <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white text-center text-2xl tracking-widest placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                    required
                    maxLength={6}
                />
            </div>

            {/* Verify Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Verifying...' : 'Verify Email'}
            </motion.button>

            {/* Resend OTP */}
            <div className="text-center">
                <button
                    type="button"
                    onClick={onResend}
                    disabled={loading}
                    className="text-blue-500 hover:text-blue-400 transition text-sm font-medium disabled:opacity-50"
                >
                    Resend Code
                </button>
            </div>

            {/* Back Button */}
            <button
                type="button"
                onClick={onBack}
                className="w-full text-gray-400 hover:text-white transition text-sm"
            >
                ← Back to signup
            </button>
        </form>
    );
}

export default SignupOtpVerification;
