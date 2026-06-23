// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // <--- Ye line add ki hai

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQP_x97H2DZng5tFsia9iBWILozC7kmg4",
  authDomain: "web-development-internsh-87db8.firebaseapp.com",
  projectId: "web-development-internsh-87db8",
  storageBucket: "web-development-internsh-87db8.firebasestorage.app",
  messagingSenderId: "663193515525",
  appId: "1:663193515525:web:67ebc799382ce76e198e6c",
  measurementId: "G-GVC4PRTWCK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore, Auth and EXPORT them
export const db = getFirestore(app);
export const auth = getAuth(app); // <--- Ye export zaroori hai