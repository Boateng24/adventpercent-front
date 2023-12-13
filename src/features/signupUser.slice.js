import {createSlice} from '@reduxjs/toolkit';
import {toast} from 'react-toastify';
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { authBase } from '../api/backend.api';


export const signupUser = createAsyncThunk("signup", async (args, thunkApi) => {
  try {
    const response = await axios.post(`${authBase}/registerUser`, {...args});
    console.log(response)
    return {...response.data, status: response.status}
  } catch (error) {
    return thunkApi.rejectWithValue(error.payload?.message);
  }
});

const initialUserState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  status: 0,
};


const signupSlice  = createSlice({
    name: 'signup',
    initialState: initialUserState,
    reducers: {},
    extraReducers(builder) {
        builder
          .addCase(signupUser.pending, (state) => {
            state.loading = true;
            state.error = null;
          })

          .addCase(signupUser.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.error = null;

            console.log(action.payload)
          })

          .addCase(
            signupUser.rejected,
            (state, action) => {
              state.loading = false;
              state.error = action.payload
              toast('Signup failed')
            }
          )
        }     
})

export default signupSlice.reducer;


