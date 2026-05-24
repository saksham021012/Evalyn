import * as authService from '../services/authService.js';

// Signup - Step 1: Send OTP
// POST /api/auth/signup
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

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

        const data = await authService.signupUser(name, email, password);

        res.status(200).json({
            success: true,
            message: 'OTP sent to your email. Please verify to complete signup.',
            data
        });

    } catch (error) {
        console.error('Error in signup:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server error',
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

        const data = await authService.verifyUserOTP(email, otp, name, password);

        res.status(201).json({
            success: true,
            message: 'Email verified successfully. Account created!',
            data
        });

    } catch (error) {
        console.error('Error in verifyOTP:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server error',
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

        await authService.resendUserOTP(email);

        res.json({
            success: true,
            message: 'New OTP sent to your email'
        });

    } catch (error) {
        console.error('Error in resendOTP:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server error',
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

        const data = await authService.loginUser(email, password);

        res.json({
            success: true,
            message: 'Login successful',
            data
        });

    } catch (error) {
        console.error('Error in login:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server error',
            error: error.message
        });
    }
};

// Get current user (requires auth)
// GET /api/auth/me
export const getCurrentUser = async (req, res) => {
    try {
        const data = await authService.getUserById(req.userId);

        res.json({
            success: true,
            data
        });

    } catch (error) {
        console.error('Error in getCurrentUser:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server error',
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

        const data = await authService.sendResetUserOTP(email);

        res.status(200).json(data);

    } catch (error) {
        console.error('Error in sendResetOTP:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server error',
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

        await authService.resetUserPassword(email, otp, newPassword);

        res.json({
            success: true,
            message: 'Password reset successfully. Please login with your new password.'
        });

    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server error',
            error: error.message
        });
    }
};
