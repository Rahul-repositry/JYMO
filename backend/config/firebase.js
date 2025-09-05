const admin = require("firebase-admin");
const dotenv = require('dotenv');

dotenv.config();

let firebaseApp;

// Check if Firebase is already initialized
if (!admin.apps.length) {
  // For Vercel deployment - use environment variables
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      // Parse the JSON string from environment variable
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      
      console.log('Firebase initialized with environment variables');
    } catch (error) {
      console.error('Error initializing Firebase with environment variables:', error);
      throw error;
    }
  } 
  // For local development - try to use service key file
  else {
    try {
      const serviceAccount = require("./serviceKey.json");
      
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      
      console.log('Firebase initialized with service key file');
    } catch (error) {
      console.error('Error initializing Firebase with service key file:', error);
      console.error('Make sure serviceKey.json exists or set FIREBASE_SERVICE_ACCOUNT environment variable');
      throw error;
    }
  }
}

module.exports = admin;
