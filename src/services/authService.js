import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../config/firebase';
import { toast } from 'react-toastify';

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // You can send this user data to your backend to create/login user
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      provider: 'google'
    };
    
    toast.success('Successfully signed in with Google!');
    return userData;
  } catch (error) {
    console.error('Google sign-in error:', error);
    toast.error('Failed to sign in with Google');
    throw error;
  }
};

export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;
    
    // You can send this user data to your backend to create/login user
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      provider: 'facebook'
    };
    
    toast.success('Successfully signed in with Facebook!');
    return userData;
  } catch (error) {
    console.error('Facebook sign-in error:', error);
    toast.error('Failed to sign in with Facebook');
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    toast.success('Successfully signed out!');
  } catch (error) {
    console.error('Sign-out error:', error);
    toast.error('Failed to sign out');
    throw error;
  }
};