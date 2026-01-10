import { motion } from 'framer-motion';

function OtpStep({ otp, setOtp, loading, onVerify, onResend, onChangeEmail }) {
    return (
        <form onSubmit={onVerify} className="space-y-5">
            <div>
                <label className="block text-gray-400 text-sm mb-2 font-bold tracking-wide">
                    VERIFICATION CODE
                </label>
                <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white text-center text-2xl tracking-[0.5em] placeholder-gray-600 focus:outline-none focus:border-blue-500 transition font-mono"
                    required
                    maxLength={6}
                />
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
            >
                Verify & Continue
            </motion.button>

            <div className="text-center">
                <button
                    type="button"
                    onClick={onResend}
                    disabled={loading}
                    className="text-blue-500 hover:text-blue-400 transition text-sm font-bold disabled:opacity-50"
                >
                    Resend Code
                </button>
            </div>

            <button
                type="button"
                onClick={onChangeEmail}
                className="w-full text-center text-gray-400 hover:text-white transition text-sm mt-2"
            >
                Change Email
            </button>
        </form>
    );
}

export default OtpStep;
