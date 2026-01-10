import { toast } from 'react-hot-toast';
import { setLoading } from '../../redux/slices/authSlice';
import { setResumeData } from '../../redux/slices/resumeSlice';
import { apiConnector } from '../apiconnector';
import { endpoints } from '../api';

const { UPLOAD_RESUME_API, PARSE_RESUME_API, ANALYZE_RESUME_API } = endpoints;

export function uploadResume(file, targetRole, navigate) {
    return async (dispatch) => {
        const toastId = `upload-resume-${Date.now()}`;
        toast.loading('Processing & Parsing Resume...', { id: toastId });
        dispatch(setLoading(true));
        try {
            const formData = new FormData();
            formData.append('resume', file);
            formData.append('targetRole', targetRole);

            const response = await apiConnector('POST', UPLOAD_RESUME_API, formData, null, {
                'Content-Type': 'multipart/form-data',
            });

            console.log('UPLOAD RESUME API RESPONSE............', response);

            if (!response.success) {
                throw new Error(response.message);
            }

            toast.success('Resume Uploaded & Parsed Successfully', { id: toastId });
            dispatch(setResumeData(response.data));

            if (navigate) {
                navigate('/interview');
            }

            return response.data;
        } catch (error) {
            console.log('UPLOAD RESUME API ERROR............', error);
            toast.error(error.message || 'Failed to Upload Resume', { id: toastId });
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function parseResume(file) {
    return async (dispatch) => {
        const toastId = toast.loading('Parsing Resume...');
        dispatch(setLoading(true));
        try {
            const formData = new FormData();
            formData.append('resume', file);

            const response = await apiConnector('POST', PARSE_RESUME_API, formData, null, {
                'Content-Type': 'multipart/form-data',
            });

            console.log('PARSE RESUME API RESPONSE............', response);

            if (!response.success) {
                throw new Error(response.message);
            }

            toast.success('Resume Parsed Successfully', { id: toastId });
            return response.data;
        } catch (error) {
            console.log('PARSE RESUME API ERROR............', error);
            toast.error(error.message || 'Failed to Parse Resume', { id: toastId });
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function analyzeResume(resumeId, targetRole) {
    return async (dispatch) => {
        const toastId = toast.loading('Analyzing Resume...');
        dispatch(setLoading(true));
        try {
            const response = await apiConnector('POST', ANALYZE_RESUME_API, {
                resumeId,
                targetRole,
            });

            console.log('ANALYZE RESUME API RESPONSE............', response);

            if (!response.success) {
                throw new Error(response.message);
            }

            toast.success('Resume Analyzed Successfully', { id: toastId });
            return response.data;
        } catch (error) {
            console.log('ANALYZE RESUME API ERROR............', error);
            toast.error(error.message || 'Failed to Analyze Resume', { id: toastId });
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function getUserResumes(userId) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await apiConnector('GET', `${endpoints.GET_USER_RESUMES_API}/${userId}`);

            console.log('GET USER RESUMES API RESPONSE............', response);

            if (!response.success) {
                throw new Error(response.message);
            }

            return response.data;
        } catch (error) {
            console.log('GET USER RESUMES API ERROR............', error);
            // We keep the error toast because a failure to fetch is important to notify
            toast.error(error.message || 'Failed to Get User Resumes');
            return [];
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function setActiveResume(resumeId) {
    return async (dispatch) => {
        const toastId = toast.loading('Updating Active Status...');
        dispatch(setLoading(true));
        try {
            const response = await apiConnector('PUT', `${UPLOAD_RESUME_API.replace('/upload', '')}/${resumeId}/active`);

            console.log('SET ACTIVE RESUME API RESPONSE............', response);

            if (!response.success) {
                throw new Error(response.message);
            }

            toast.success('Active Resume Updated', { id: toastId });
            return true;
        } catch (error) {
            console.log('SET ACTIVE RESUME API ERROR............', error);
            toast.error(error.message || 'Failed to Update Active Status', { id: toastId });
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function deleteResume(resumeId) {
    return async (dispatch) => {
        const toastId = toast.loading('Deleting Resume...');
        dispatch(setLoading(true));
        try {
            const response = await apiConnector('DELETE', `${UPLOAD_RESUME_API.replace('/upload', '')}/${resumeId}`);

            console.log('DELETE RESUME API RESPONSE............', response);

            if (!response.success) {
                throw new Error(response.message);
            }

            toast.success('Resume Deleted Successfully', { id: toastId });
            return true;
        } catch (error) {
            console.log('DELETE RESUME API ERROR............', error);
            toast.error(error.message || 'Failed to Delete Resume', { id: toastId });
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function downloadResume(resumeId, fileName) {
    return async (dispatch) => {
        const toastId = toast.loading('Preparing Download...');
        dispatch(setLoading(true));
        try {
            const downloadUrl = `${UPLOAD_RESUME_API.replace('/upload', '')}/${resumeId}/download`;
            window.open(downloadUrl, '_blank');
            toast.success('Download Started', { id: toastId });
            return true;
        } catch (error) {
            console.log('DOWNLOAD RESUME API ERROR............', error);
            toast.error(error.message || 'Failed to Download Resume', { id: toastId });
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    };
}
