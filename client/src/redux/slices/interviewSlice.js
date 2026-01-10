import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    interviewSession: null,
    currentQuestion: null,
};

const interviewSlice = createSlice({
    name: 'interview',
    initialState,
    reducers: {
        setInterviewSession: (state, action) => {
            state.interviewSession = action.payload;
        },
        setCurrentQuestion: (state, action) => {
            state.currentQuestion = action.payload;
        },
    },
});

export const { setInterviewSession, setCurrentQuestion } = interviewSlice.actions;
export default interviewSlice.reducer;
