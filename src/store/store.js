import { configureStore } from '@reduxjs/toolkit';
import signupUserSlice from '../features/signupUser.slice';
import loginUserSlice from '../features/loginUser.slice';


const store = configureStore({
    reducer:{
        signupUser: signupUserSlice,
        loginUser: loginUserSlice
    }
})


export default store;