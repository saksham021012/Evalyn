import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
    token: localStorage.getItem('token') || null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
    },
});

export const { setLoading, setToken } = authSlice.actions;
export default authSlice.reducer;
