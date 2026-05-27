import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { authBase } from '../api/backend.api';

export const forgotPassword = createAsyncThunk(
  'passwordReset/forgot',
  async (email, thunkApi) => {
    try {
      const response = await axios.post(`${authBase}/forgot-password`, { email });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data?.message ?? error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'passwordReset/reset',
  async ({ token, newPassword, confirmPassword }, thunkApi) => {
    try {
      const response = await axios.post(`${authBase}/reset-password`, { token, newPassword, confirmPassword });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data?.message ?? error.message);
    }
  }
);

const passwordResetSlice = createSlice({
  name: 'passwordReset',
  initialState: { loading: false, error: null, success: false },
  reducers: {
    clearResetState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgotPassword.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
      .addCase(forgotPassword.fulfilled, (state) => { state.loading = false; state.success = true; })
      .addCase(forgotPassword.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(resetPassword.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
      .addCase(resetPassword.fulfilled, (state) => { state.loading = false; state.success = true; })
      .addCase(resetPassword.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearResetState } = passwordResetSlice.actions;
export default passwordResetSlice.reducer;
