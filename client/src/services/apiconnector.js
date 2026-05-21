import axios from 'axios';

const axiosInstance = axios.create();

export const apiConnector = async (
    method,
    url,
    bodyData = null,
    params = null,
    headers = null,
    responseType = 'json'
) => {
    try {
        const token = localStorage.getItem('token');

        const config = {
            method,
            url,
            timeout: 60000,
            responseType,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        };

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (bodyData) {
            config.data = bodyData;
        }

        if (params) {
            config.params = params;
        }

        const response = await axiosInstance(config);
        return response.data;
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    // Only redirect if the 401 error didn't occur during the login/signup/verification phase itself
                    if (!url.includes('/auth/login') && 
                        !url.includes('/auth/signup') && 
                        !url.includes('/auth/verify-otp') && 
                        !url.includes('/auth/forgot-password') && 
                        !url.includes('/auth/reset-password')) {
                        window.location.href = '/login';
                    }
                    break;
                case 403:
                    console.error('Access forbidden:', data.message);
                    break;
                case 404:
                    console.error('Resource not found:', data.message);
                    break;
                case 500:
                    console.error('Server error:', data.message);
                    break;
                default:
                    console.error('API Error:', data.message || 'Unknown error');
            }

            throw data;
        } else if (error.request) {
            console.error('Network error: No response from server');
            throw { message: 'Network error. Please check your connection.' };
        } else {
            console.error('Error:', error.message);
            throw { message: error.message };
        }
    }
};
