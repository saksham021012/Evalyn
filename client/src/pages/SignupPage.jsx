import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { signup, verifyOTP } from '../services';
import SignupForm from '../components/auth/Signup/SignupForm';
import SignupOtpVerification from '../components/auth/Signup/SignupOtpVerification';

function SignupPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);
    const [step, setStep] = useState(1); // 1: signup form, 2: OTP verification
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [otp, setOtp] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        const result = await dispatch(signup(formData.name, formData.email, formData.password, navigate));
        if (result) {
            setStep(2);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        dispatch(verifyOTP(formData.name, formData.email, formData.password, otp, navigate));
    };

    const handleResendOTP = async () => {
        dispatch(signup(formData.name, formData.email, formData.password, navigate));
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Logo */}
            <Link to="/" className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 text-white font-bold text-lg sm:text-xl">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs sm:text-sm">EV</span>
                </div>
                <span className="hidden sm:inline">Evalyn</span>
            </Link>

            {/* Support Button */}
            <button className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition">
                Support
            </button>

            {/* Signup Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md mt-12 sm:mt-0"
            >
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        {step === 1 ? 'Create your account' : 'Verify your email'}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-400">
                        {step === 1
                            ? 'Get started with AI-powered mock interviews'
                            : `We sent a code to ${formData.email}`
                        }
                    </p>
                </div>

                {/* Card */}
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8">
                    {step === 1 ? (
                        <SignupForm
                            formData={formData}
                            setFormData={setFormData}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            onSubmit={handleSignup}
                            loading={loading}
                        />
                    ) : (
                        <SignupOtpVerification
                            otp={otp}
                            setOtp={setOtp}
                            onVerify={handleVerifyOTP}
                            onResend={handleResendOTP}
                            onBack={() => setStep(1)}
                            loading={loading}
                        />
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default SignupPage;
