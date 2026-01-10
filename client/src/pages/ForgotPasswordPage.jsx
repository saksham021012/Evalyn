import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
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

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-inter">
            {/* Logo */}
            <Link to="/" className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 text-white font-bold text-lg sm:text-xl">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs sm:text-sm">EV</span>
                </div>
                <span className="hidden sm:inline">Evalyn</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md mt-12 sm:mt-0"
            >
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        {step === 1 && 'Reset your password'}
                        {step === 2 && 'Verify it\'s you'}
                        {step === 3 && 'Set new password'}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-400">
                        {step === 1 && 'Enter your email and we\'ll send you a recovery code.'}
                        {step === 2 && `We sent a code to ${email}`}
                        {step === 3 && 'Secure your account with a new password.'}
                    </p>
                </div>

                {/* Card */}
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">

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
