const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const endpoints = {
    // Auth endpoints
    SIGNUP_API: `${BASE_URL}/auth/signup`,
    VERIFY_OTP_API: `${BASE_URL}/auth/verify-otp`,
    LOGIN_API: `${BASE_URL}/auth/login`,
    LOGOUT_API: `${BASE_URL}/auth/logout`,
    FORGOT_PASSWORD_API: `${BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD_API: `${BASE_URL}/auth/reset-password`,

    // Resume endpoints
    UPLOAD_RESUME_API: `${BASE_URL}/resumes/upload`,
    PARSE_RESUME_API: `${BASE_URL}/resumes/parse`,
    ANALYZE_RESUME_API: `${BASE_URL}/resumes/analyze`,

    // Interview endpoints
    START_INTERVIEW_API: `${BASE_URL}/interviews/create`, // Assuming startInterview in frontend maps to createInterview backend
    GET_QUESTION_API: `${BASE_URL}/interviews/question`, // This might need fix too, backend is /:id/next-question or similar?
    SUBMIT_ANSWER_API: `${BASE_URL}/interviews/submit-answer`, // Backend is /:id/answer
    END_INTERVIEW_API: `${BASE_URL}/interviews/end`, // Backend is /:id/complete
    GET_SESSION_API: `${BASE_URL}/interviews/session`, // Backend is /:id

    // Results endpoints
    // Results endpoints
    GET_RESULTS_API: `${BASE_URL}/interviews`, // Will be appended with /:id, matching GET /api/interviews/:id
    GET_EVALUATION_API: `${BASE_URL}/results/evaluation`,
    GET_TRANSCRIPT_API: `${BASE_URL}/results/transcript`,
    DOWNLOAD_REPORT_API: `${BASE_URL}/results/download`,

    // User endpoints
    GET_USER_INTERVIEWS_API: `${BASE_URL}/interviews/user`,
    GET_USER_RESUMES_API: `${BASE_URL}/resumes/user`,
};
