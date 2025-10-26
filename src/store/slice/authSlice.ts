import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from '../types';

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.token = action.payload;
      state.error = null;
      localStorage.setItem('token', action.payload);
    },
    
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.token = null;
    },
    
    logout: (state) => {
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;