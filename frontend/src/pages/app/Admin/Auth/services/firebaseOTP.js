// services/firebaseOTP.js
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../../../../firebase";

export class FirebaseOTPService {
  constructor() {
    this.confirmationResult = null;
  }

  // Ensures recaptcha is clean and ready
  setupRecaptcha = (containerId = "recaptcha-container") => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
      callback: () => console.log("reCAPTCHA solved"),
    });
    return window.recaptchaVerifier;
  };

  sendOTP = async (phoneNumber) => {
    try {
      const appVerifier = this.setupRecaptcha();
      const formattedPhone = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+91${phoneNumber}`;
      this.confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier,
      );
      return { success: true };
    } catch (error) {
      console.error("Firebase Send Error:", error);
      throw this.handleError(error);
    }
  };

  verifyOTP = async (otp) => {
    try {
      if (!this.confirmationResult)
        throw new Error("Session expired. Please resend OTP.");
      const result = await this.confirmationResult.confirm(otp);
      // This ID Token is what we send to the backend to prove the user is verified
      const idToken = await result.user.getIdToken();
      return { success: true, idToken };
    } catch (error) {
      console.error("Firebase Verify Error:", error);
      throw this.handleError(error);
    }
  };

  handleError = (error) => {
    switch (error.code) {
      case "auth/too-many-requests":
        return new Error("Too many attempts. Try again later.");
      case "auth/invalid-verification-code":
        return new Error("Invalid OTP code.");
      case "auth/code-expired":
        return new Error("OTP expired. Resend it.");
      default:
        return new Error("Authentication failed. Check your connection.");
    }
  };
}

export const firebaseOTPService = new FirebaseOTPService();
