// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
let firebaseConfig;

// Try to use the config from environment variable
if (process.env.REACT_APP_FIREBASE_CONFIG) {
  try {
    firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG);
    console.log("Using Firebase config from environment variable");
  } catch (error) {
    console.error("Error parsing Firebase config from environment variable:", error);
    throw new Error("Invalid Firebase configuration. Please check your environment variables.");
  }
} else {
  console.error("REACT_APP_FIREBASE_CONFIG environment variable is not set");
  throw new Error("Firebase configuration is missing. Please set the REACT_APP_FIREBASE_CONFIG environment variable.");
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Analytics only if browser environment is available
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.error("Analytics failed to initialize:", error);
  }
}
export { analytics };
