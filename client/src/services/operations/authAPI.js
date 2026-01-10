import { toast } from 'react-hot-toast';
import { setLoading, setToken } from '../../redux/slices/authSlice';
import { setUser } from '../../redux/slices/profileSlice';
import { apiConnector } from '../apiconnector';
import { endpoints } from '../api';

const { SIGNUP_API, VERIFY_OTP_API, LOGIN_API, LOGOUT_API } = endpoints;

export function signup(name, email, password, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));
        try {
            const response = await apiConnector('POST', SIGNUP_API, {
                name,
                email,
                password,
            });

            console.log('SIGNUP API RESPONSE............', response);

            if (!response.success) {
                throw new Error(response.message);
            }

            toast.success('Signup Successful - Check your email for OTP');
            dispatch(setLoading(false));
            toast.dismiss(toastId);
            return true;
        } catch (error) {
            console.log('SIGNUP API ERROR............', error);
            toast.error(error.message || 'Signup Failed');
            dispatch(setLoading(false));
            toast.dismiss(toastId);
            return false;
        }
    };
}

export function verifyOTP(name, email, password, otp, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading('Verifying...');
        dispatch(setLoading(true));
        try {
            const response = await apiConnector('POST', VERIFY_OTP_API, {
                name,
                email,
                password,
                otp,
            });

            console.log('VERIFY OTP API RESPONSE............', response);

            if (!response.success) {
                throw new Error(response.message);
            }

            toast.success('Email Verified Successfully');
            dispatch(setToken(response.data.token));
            dispatch(setUser(response.data.user));
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (error) {
            console.log('VERIFY OTP API ERROR............', error);
            toast.error(error.message || 'OTP Verification Failed');
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    };
}

export function login(email, password, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));
        try {
            const response = await apiConnector('POST', LOGIN_API, {
                email,
                password,
            });

            console.log('LOGIN API RESPONSE............', response);

            if (!response.success) {
                throw new Error(response.message);
            }

            toast.success('Login Successful');
            dispatch(setToken(response.data.token));
            dispatch(setUser(response.data.user));
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (error) {
            console.log('LOGIN API ERROR............', error);
            toast.error(error.message || 'Login Failed');
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    };
}

export function sendForgotOtp(email) {
    return async (dispatch) => {
        const toastId = toast.loading('Sending Verification Code...');
        dispatch(setLoading(true));
        try {
            const response = await apiConnector('POST', endpoints.FORGOT_PASSWORD_API, { email });

            console.log('FORGOT PASS API RESPONSE............', response);

            if (!response.success) {
                throw new Error(response.message);
            }

            toast.success(response.message || 'Verification Code Sent');
            dispatch(setLoading(false));
            toast.dismiss(toastId);
            return true;
        } catch (error) {
            console.log('FORGOT PASS API ERROR............', error);
            toast.error(error.message || 'Failed to send verification code');
            dispatch(setLoading(false));
            toast.dismiss(toastId);
            return false;
        }
    };
}

export function resetPassword(email, otp, newPassword, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading('Resetting Password...');
        dispatch(setLoading(true));
        try {
            const response = await apiConnector('POST', endpoints.RESET_PASSWORD_API, {
                email,
                otp,
                newPassword
            });

            console.log('RESET PASS API RESPONSE............', response);

            if (!response.success) {
                throw new Error(response.message);
            }

            toast.success('Password Reset Successfully');
            navigate('/login');
        } catch (error) {
            console.log('RESET PASS API ERROR............', error);
            toast.error(error.message || 'Password Reset Failed');
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    };
}

export function logout(navigate) {
    return (dispatch) => {
        dispatch(setToken(null));
        dispatch(setUser(null));
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Logged Out');
        navigate('/');
    };
}

export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};
