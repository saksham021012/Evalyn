import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import { sendForgotOtp, resetPassword } from '../services/operations/authAPI';
import EmailStep from '../components/auth/ForgotPassword/EmailStep';
import OtpStep from '../components/auth/ForgotPassword/OtpStep';
import NewPasswordStep from '../components/auth/ForgotPassword/NewPasswordStep';

function ForgotPasswordPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleSendOtp = async (e) => {
        e.preventDefault();
        const success = await dispatch(sendForgotOtp(email));
        if (success) {
            setStep(2);
        }
    };

    const handleVerifyOtpLocal = (e) => {
        e.preventDefault();
        // Since we verify at the end, just ensure OTP is filled.
        if (otp.length === 6) {
            setStep(3);
        }
    };

    const handleResendOtp = () => {
        dispatch(sendForgotOtp(email));
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        dispatch(resetPassword(email, otp, newPassword, navigate));
    };

    const stepLabels = {
        1: 'Account Recovery',
        2: 'Verify Identity',
        3: 'New Password',
    };

    const stepTitles = {
        1: 'Reset your password',
        2: "Verify it's you",
        3: 'Set new password',
    };

    const stepSubtitles = {
        1: "Enter your email and we'll send you a recovery code.",
        2: `We sent a code to ${email}`,
        3: 'Secure your account with a new password.',
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

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md mt-12 sm:mt-0"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    {/* Step progress dots */}
                    <div className="flex items-center justify-center gap-1.5 mb-4">
                        {[1, 2, 3].map((s) => (
                            <span
                                key={s}
                                className={`rounded-full transition-all duration-300 ${
                                    s === step
                                        ? 'w-4 h-1.5 bg-[#2b4c3f]'
                                        : s < step
                                        ? 'w-1.5 h-1.5 bg-[#2b4c3f]/50'
                                        : 'w-1.5 h-1.5 bg-zinc-300'
                                }`}
                            />
                        ))}
                    </div>
                    <div className="inline-flex items-center gap-2 mb-3">
                        <span className="w-1.5 h-1.5 bg-[#2b4c3f] rounded-full"></span>
                        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-500">
                            {stepLabels[step]}
                        </span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#1c1917] mb-2 font-serif tracking-tight">
                        {stepTitles[step]}
                    </h1>
                    <p className="text-sm text-zinc-500 font-sans">
                        {stepSubtitles[step]}
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white/90 backdrop-blur-md border border-zinc-200 shadow-sm rounded-xl p-6 sm:p-8">
                    {/* Step 1: Email */}
                    {step === 1 && (
                        <EmailStep
                            email={email}
                            setEmail={setEmail}
                            loading={loading}
                            onSendOtp={handleSendOtp}
                        />
                    )}

                    {/* Step 2: OTP */}
                    {step === 2 && (
                        <OtpStep
                            otp={otp}
                            setOtp={setOtp}
                            loading={loading}
                            onVerify={handleVerifyOtpLocal}
                            onResend={handleResendOtp}
                            onChangeEmail={() => setStep(1)}
                        />
                    )}

                    {/* Step 3: New Password */}
                    {step === 3 && (
                        <NewPasswordStep
                            newPassword={newPassword}
                            setNewPassword={setNewPassword}
                            loading={loading}
                            onSubmit={handleResetPassword}
                        />
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default ForgotPasswordPage;
