import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { authBase } from "../api/backend.api";

export const loginUser = createAsyncThunk("login", async (args, thunkApi) => {
  try {
    const response = await axios.post(`${authBase}/loginUser`, { ...args });
    console.log(response);
    return { ...response.data, status: response.status };
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data ?? error.message);
  }
});




 const initialLoginState = {
    user: null,
    isAuthenticated: false,
    accessToken: null,
    loading: false,
    error: null,
    status: 0,
  }


  const loginSlice = createSlice({
    name: "login",
    initialState: initialLoginState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(loginUser.pending, (state) => {
          state.loading = true
          state.isAuthenticated = false
        })
        .addCase(loginUser.fulfilled, (state, action) => {
          state.status = 200;
          state.isAuthenticated = true
          state.user = action.payload.loggedInUser;
          state.accessToken = action.payload.accessToken;
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.loading= false;
          state.isAuthenticated = false;
          state.error = action.payload.error
          toast(state.error)
        });
    },
  });

  export default loginSlice.reducer;



