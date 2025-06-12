// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA_IhyreQefDgJ2iySCCtN3vUmfH8rZKug",
  authDomain: "advent-percent.firebaseapp.com",
  projectId: "advent-percent",
  storageBucket: "advent-percent.firebasestorage.app",
  messagingSenderId: "701644999186",
  appId: "1:701644999186:web:c1bd7a481cbfefaecd26cb",
  measurementId: "G-Y036THGXNP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// const analytics = getAnalytics(app);
export default app;