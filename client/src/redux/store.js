import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import resumeReducer from './slices/resumeSlice';
import interviewReducer from './slices/interviewSlice';
import resultsReducer from './slices/resultsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        resume: resumeReducer,
        interview: interviewReducer,
        results: resultsReducer,
    },
});
