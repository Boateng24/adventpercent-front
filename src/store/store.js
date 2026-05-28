import { configureStore } from '@reduxjs/toolkit';
import signupUserSlice from '../features/signupUser.slice';
import loginUserSlice from '../features/loginUser.slice';
import socialAuthSlice from '../features/socialAuth.slice';
import passwordResetSlice from '../features/passwordReset.slice';
import songsSlice from '../features/songs.slice';
import queueSlice from '../features/queue.slice';

const store = configureStore({
  reducer: {
    signupUser: signupUserSlice,
    loginUser: loginUserSlice,
    socialAuth: socialAuthSlice,
    passwordReset: passwordResetSlice,
    songs: songsSlice,
    queue: queueSlice,
  },
});

export default store;
