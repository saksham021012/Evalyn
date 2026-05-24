import User from '../models/User.js';
import OTP from '../models/OTP.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { generateOTP, sendOTPEmail, sendWelcomeEmail } from '../utils/emailService.js';

// Generate JWT token
export const generateToken = (userId) => {
    return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '7d' });
};

export const signupUser = async (name, email, password) => {
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
        if (existingUser.isEmailVerified) {
            const error = new Error('Email already registered. Please login.');
            error.statusCode = 400;
            throw error;
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
        const error = new Error('Failed to send OTP email. Please try again.');
        error.statusCode = 500;
        throw error;
    }

    return {
        email: email.toLowerCase(),
        otpSent: true
    };
};

export const verifyUserOTP = async (email, otp, name, password) => {
    // Find OTP
    const otpDoc = await OTP.findOne({
        email: email.toLowerCase(),
        otp,
        purpose: 'signup',
        verified: false
    });

    if (!otpDoc) {
        const error = new Error('Invalid or expired OTP');
        error.statusCode = 400;
        throw error;
    }

    // Check if OTP is expired
    if (otpDoc.expiresAt < new Date()) {
        await OTP.deleteOne({ _id: otpDoc._id });
        const error = new Error('OTP has expired. Please request a new one.');
        error.statusCode = 400;
        throw error;
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

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            isEmailVerified: user.isEmailVerified
        }
    };
};

export const resendUserOTP = async (email) => {
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
        const error = new Error('Failed to send OTP email');
        error.statusCode = 500;
        throw error;
    }

    return true;
};

export const loginUser = async (email, password) => {
    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
        const error = new Error('Please verify your email first');
        error.statusCode = 401;
        throw error;
    }

    // Check if account is active
    if (!user.isActive) {
        const error = new Error('Account is deactivated. Please contact support.');
        error.statusCode = 401;
        throw error;
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    // Generate token
    const token = generateToken(user._id);

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            isEmailVerified: user.isEmailVerified
        }
    };
};

export const getUserById = async (userId) => {
    const user = await User.findById(userId).select('-password');

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    return user;
};

export const sendResetUserOTP = async (email) => {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        // Return true to avoid revealing if user exists or not
        return {
            success: true,
            message: 'If an account exists with this email, a verification code has been sent.'
        };
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

    return {
        success: true,
        message: 'Verification code sent to your email'
    };
};

export const resetUserPassword = async (email, otp, newPassword) => {
    // Verify OTP
    const otpDoc = await OTP.findOne({
        email: email.toLowerCase(),
        otp,
        purpose: 'reset_password',
        verified: false
    });

    if (!otpDoc) {
        const error = new Error('Invalid or expired verification code');
        error.statusCode = 400;
        throw error;
    }

    if (otpDoc.expiresAt < new Date()) {
        await OTP.deleteOne({ _id: otpDoc._id });
        const error = new Error('Verification code has expired');
        error.statusCode = 400;
        throw error;
    }

    // Find User
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    // Update Password
    user.password = newPassword;
    await user.save();

    // Delete OTP
    await OTP.deleteMany({ email: email.toLowerCase(), purpose: 'reset_password' });

    return true;
};
