import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithGoogle } from '../services/authService';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

export const googleSignIn = createAsyncThunk(
  'socialAuth/googleSignIn',
  async (_, thunkApi) => {
    try {
      // authService now handles both Firebase popup and backend JWT exchange
      const userData = await signInWithGoogle();
      return userData;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data?.message ?? error.message);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  role: null,
  isAdmin: false,
  loading: false,
  error: null,
};

const socialAuthSlice = createSlice({
  name: 'socialAuth',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    socialLogout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
      state.isAdmin = false;
      Cookies.remove('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(googleSignIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleSignIn.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.role = action.payload.role;
        state.isAdmin = action.payload.isAdmin;
        Cookies.set('token', action.payload.accessToken);
      })
      .addCase(googleSignIn.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
        toast.error('Google sign-in failed');
      });
  },
});

export const { clearError, socialLogout } = socialAuthSlice.actions;
export default socialAuthSlice.reducer;
