import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithGoogle } from '../services/authService';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

// Async thunk for Google sign-in
export const googleSignIn = createAsyncThunk(
  'socialAuth/googleSignIn',
  async (_, thunkApi) => {
    try {
      const userData = await signInWithGoogle();
      return userData;
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const socialAuthSlice = createSlice({
  name: 'socialAuth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    socialLogout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      Cookies.remove('socialToken');
    },
  },
  extraReducers: (builder) => {
    builder
      // Google Sign-in
      .addCase(googleSignIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleSignIn.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
        // Store user token or data in cookies if needed
        Cookies.set('socialToken', action.payload.uid);
      })
      .addCase(googleSignIn.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
        toast.error('Google sign-in failed');
      })
  },
});

export const { clearError, socialLogout } = socialAuthSlice.actions;
export default socialAuthSlice.reducer;