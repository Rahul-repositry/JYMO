// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// let firebaseConfig;

// // Try to use the config from environment variable
// if (process.env.REACT_APP_FIREBASE_CONFIG) {
//   try {
//     firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG);
//   } catch (error) {
//     console.error(
//       "Error parsing Firebase config from environment variable:",
//       error,
//     );
//     throw new Error(
//       "Invalid Firebase configuration. Please check your environment variables.",
//     );
//   }
// } else {
//   throw new Error(
//     "Firebase configuration is missing. Please set the REACT_APP_FIREBASE_CONFIG environment variable.",
//   );
// }

const firebaseConfig = {
  apiKey: "AIzaSyD3My5lCXAUSRVxG3D8gQMjeVxTmvllL30",
  authDomain: "jymo-fd1bb.firebaseapp.com",
  projectId: "jymo-fd1bb",
  storageBucket: "jymo-fd1bb.appspot.com",
  messagingSenderId: "51256135709",
  appId: "1:51256135709:web:a1432e203546eac8df76f4",
  measurementId: "G-HZHCFDB35C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Export auth to use elsewhere
auth.languageCode = "en";

export { auth, app };
