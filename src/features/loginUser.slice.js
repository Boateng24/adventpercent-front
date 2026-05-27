import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axios from 'axios';
import { authBase } from '../api/backend.api';
import Cookies from 'js-cookie';

export const loginUser = createAsyncThunk('login', async (args, thunkApi) => {
  try {
    const response = await axios.post(`${authBase}/loginUser`, { ...args });
    return { ...response.data, status: response.status };
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message ?? error.message);
  }
});

export const userLogout = () => (dispatch) => {
  Cookies.remove('token');
  dispatch({ type: 'login/reset' });
};

const initialLoginState = {
  user: null,
  isAuthenticated: false,
  accessToken: null,
  role: null,
  isAdmin: false,
  loading: false,
  error: null,
  status: 0,
};

const loginSlice = createSlice({
  name: 'login',
  initialState: initialLoginState,
  reducers: {
    reset: () => initialLoginState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 200;
        state.isAuthenticated = true;
        state.user = action.payload.loggedInUser;
        state.accessToken = action.payload.accessToken;
        state.role = action.payload.role;
        state.isAdmin = action.payload.isAdmin;
        Cookies.set('token', action.payload.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
        toast.error(action.payload ?? 'Login failed');
      });
  },
});

export default loginSlice.reducer;
