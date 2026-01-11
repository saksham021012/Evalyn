import User from '../models/User.js';
import OTP from '../models/OTP.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { generateOTP, sendOTPEmail, sendWelcomeEmail } from '../utils/emailService.js';


// Generate JWT token

const generateToken = (userId) => {
    return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '7d' });
};


// Signup - Step 1: Send OTP
// POST /api/auth/signup

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and password'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            if (existingUser.isEmailVerified) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered. Please login.'
                });
            } else {
                // User exists but not verified, delete old OTPs and send new one
                await OTP.deleteMany({ email: email.toLowerCase(), purpose: 'signup' });
            }
        }

        // Generate OTP
        const otp = generateOTP();

        // Save OTP to database (expires in 10 minutes)
        const otpDoc = new OTP({
            email: email.toLowerCase(),
            otp,
            purpose: 'signup',
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        });

        await otpDoc.save();

        // Send OTP email
        const emailResult = await sendOTPEmail(email, otp, 'signup');

        if (!emailResult.success) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP email. Please try again.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'OTP sent to your email. Please verify to complete signup.',
            data: {
                email: email.toLowerCase(),
                otpSent: true
            }
        });

    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Verify OTP and complete signup
// POST /api/auth/verify-otp
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp, name, password } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        // Find OTP
        const otpDoc = await OTP.findOne({
            email: email.toLowerCase(),
            otp,
            purpose: 'signup',
            verified: false
        });

        if (!otpDoc) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Check if OTP is expired
        if (otpDoc.expiresAt < new Date()) {
            await OTP.deleteOne({ _id: otpDoc._id });
            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Please request a new one.'
            });
        }

        // Mark OTP as verified
        otpDoc.verified = true;
        await otpDoc.save();

        // Create or update user
        let user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Create new user
            user = new User({
                name,
                email: email.toLowerCase(),
                password,
                isEmailVerified: true
            });
        } else {
            // Update existing user
            user.name = name;
            user.password = password;
            user.isEmailVerified = true;
        }

        await user.save();

        // Delete used OTP
        await OTP.deleteMany({ email: email.toLowerCase(), purpose: 'signup' });

        // Send welcome email
        sendWelcomeEmail(email, name);

        // Generate JWT token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Email verified successfully. Account created!',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    isEmailVerified: user.isEmailVerified
                }
            }
        });

    } catch (error) {
        console.error('Error in verifyOTP:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Resend OTP
// POST /api/auth/resend-otp
export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Delete old OTPs
        await OTP.deleteMany({ email: email.toLowerCase(), purpose: 'signup' });

        // Generate new OTP
        const otp = generateOTP();

        // Save new OTP
        const otpDoc = new OTP({
            email: email.toLowerCase(),
            otp,
            purpose: 'signup',
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        });

        await otpDoc.save();

        // Send OTP email
        const emailResult = await sendOTPEmail(email, otp, 'signup');

        if (!emailResult.success) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP email'
            });
        }

        res.json({
            success: true,
            message: 'New OTP sent to your email'
        });

    } catch (error) {
        console.error('Error in resendOTP:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Login
// POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
            return res.status(401).json({
                success: false,
                message: 'Please verify your email first'
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated. Please contact support.'
            });
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    isEmailVerified: user.isEmailVerified
                }
            }
        });

    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get current user (requires auth)
// GET /api/auth/me
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error('Error in getCurrentUser:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};


// Logout 
// POST /api/auth/logout
export const logout = async (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully. '
    });
};

// Send Reset Password OTP
// POST /api/auth/forgot-password
export const sendResetOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            //success true not revealing if user exists or not
            return res.status(200).json({
                success: true,
                message: 'If an account exists with this email, a verification code has been sent.'
            });
        }

        // Generate OTP
        const otp = generateOTP();

        // Delete old reset OTPs
        await OTP.deleteMany({ email: email.toLowerCase(), purpose: 'reset_password' });

        // Save OTP
        const otpDoc = new OTP({
            email: email.toLowerCase(),
            otp,
            purpose: 'reset_password',
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 mins
        });

        await otpDoc.save();

        // Send Email
        await sendOTPEmail(email, otp, 'reset_password');

        res.json({
            success: true,
            message: 'Verification code sent to your email'
        });

    } catch (error) {
        console.error('Error in sendResetOTP:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Verify OTP and Reset Password
// POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Verify OTP
        const otpDoc = await OTP.findOne({
            email: email.toLowerCase(),
            otp,
            purpose: 'reset_password',
            verified: false
        });

        if (!otpDoc) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification code'
            });
        }

        if (otpDoc.expiresAt < new Date()) {
            await OTP.deleteOne({ _id: otpDoc._id });
            return res.status(400).json({
                success: false,
                message: 'Verification code has expired'
            });
        }

        // Find User
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update Password
        user.password = newPassword;
        await user.save();

        // Delete OTP
        await OTP.deleteMany({ email: email.toLowerCase(), purpose: 'reset_password' });

        res.json({
            success: true,
            message: 'Password reset successfully. Please login with your new password.'
        });

    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
