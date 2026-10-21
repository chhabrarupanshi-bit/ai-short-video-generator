// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-short-video-generator-87e50.firebaseapp.com",
  projectId: "ai-short-video-generator-87e50",
  storageBucket: "ai-short-video-generator-87e50.firebasestorage.app",
  messagingSenderId: "1078737155029",
  appId: "1:1078737155029:web:45aca38b4059952d1c435c",
  measurementId: "G-DJEBSDRG4P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);