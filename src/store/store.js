import { configureStore } from '@reduxjs/toolkit';
import signupUserSlice from '../features/signupUser.slice';
import loginUserSlice from '../features/loginUser.slice';
import socialAuthSlice from '../features/socialAuth.slice';


const store = configureStore({
    reducer:{
        signupUser: signupUserSlice,
        loginUser: loginUserSlice,
        socialAuth: socialAuthSlice
    }
})


export default store;