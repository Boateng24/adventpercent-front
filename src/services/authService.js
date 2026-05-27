import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { toast } from 'react-toastify';
import axios from 'axios';
import { authBase } from '../api/backend.api';

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const { uid, email, displayName, photoURL } = result.user;

    // Exchange Firebase identity for a backend JWT
    const response = await axios.post(`${authBase}/social-login`, {
      email,
      provider: 'google',
      providerId: uid,
    });

    toast.success('Signed in with Google!');
    return {
      ...response.data,
      displayName,
      photoURL,
    };
  } catch (error) {
    console.error('Google sign-in error:', error);
    toast.error(error.response?.data?.message ?? 'Failed to sign in with Google');
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    toast.success('Signed out successfully');
  } catch (error) {
    console.error('Sign-out error:', error);
    toast.error('Failed to sign out');
    throw error;
  }
};
