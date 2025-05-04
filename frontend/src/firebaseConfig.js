// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getFirestore } from "firebase/firestore"; // Add if using Firestore client-side

// --- IMPORTANT ---
// Replace with your actual config object from the Firebase console
// Firebase Console > Project Settings > General > Your apps > Web app > SDK setup and configuration > Config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTzfTB8boqE0mHMSHT10rEfFRuXBL-9_M",
  authDomain: "collabconnect-f5e2d.firebaseapp.com",
  projectId: "collabconnect-f5e2d",
  storageBucket: "collabconnect-f5e2d.firebasestorage.app",
  messagingSenderId: "158393824305",
  appId: "1:158393824305:web:b1d042c2f52e274bc01110",
  measurementId: "G-ZYFJKQBFFB"
};
// --- END IMPORTANT ---


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider(); // Create Google provider instance

// Initialize Cloud Firestore and get a reference to the service (optional)
// const db = getFirestore(app);

// Export the initialized services
export { auth, googleProvider /*, db */ };