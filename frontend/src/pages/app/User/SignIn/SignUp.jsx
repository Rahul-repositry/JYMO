import React, { useState, useEffect, useRef } from "react";
import { useSignupUserContext } from "../../../../context/context";
import { toast } from "react-toastify";
import CustomButton from "../../../../components/Button/Button";
import PhoneInput from "./components/PhoneInput.jsx";
import PasswordInput from "./components/PasswordInput.jsx";
import { Link } from "react-router-dom";
import OTPInput from "./components/OTPInput.jsx";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import "./signup.css";
import { auth } from "../../../../firebase.js";

const SignUpForm = ({ onShowPersonal }) => {
  const [signupData, updateSignupData] = useSignupUserContext();
  const [otp, setOtp] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
    phoneNumber: "", // Must include country code, e.g., +91
    username: "",
  });
  const [currentStep, setCurrentStep] = useState("otp"); // 'otp', 'verify', 'final'
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);

  // 1. Create a ref to persist the verifier instance across renders
  const recaptchaVerifierRef = useRef(null);

  // State for tracking if recaptcha is ready
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);

  // 2. Initialize ReCAPTCHA once on mount
  useEffect(() => {
    if (!recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current = new RecaptchaVerifier(
          auth,
          "recaptcha-container", // Must match the ID in your JSX
          {
            size: "invisible",
            callback: (response) => {
              console.log("Recaptcha resolved");
            },
            "expired-callback": () => {
              toast.error("Recaptcha expired. Please try again.");
            },
          },
        );

        // Optional: Pre-render it
        recaptchaVerifierRef.current.render().then(() => {
          setIsRecaptchaReady(true);
        });
      } catch (err) {
        console.error("Recaptcha Init Error:", err);
      }
    }

    // 3. Cleanup on unmount (Crucial to prevent internal-error)
    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  const handleSendOTP = async () => {
    // Validate phone number before proceeding
    if (!formData.phoneNumber) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      const phoneNumberWithCode = formData.phoneNumber.startsWith("+")
        ? formData.phoneNumber
        : `+91${formData.phoneNumber}`;

      // Use the stable ref instead of window object
      const appVerifier = recaptchaVerifierRef.current;

      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumberWithCode,
        appVerifier,
      );

      setConfirmationResult(confirmation);
      toast.success("OTP sent!");
      setCurrentStep("verify");
      startTimer();
    } catch (error) {
      console.error("SMS Error:", error);
      toast.error(error.message);

      // If Firebase throws an error, we need to reset the ReCAPTCHA widget
      if (recaptchaVerifierRef.current) {
        const widgetId = await recaptchaVerifierRef.current.render();
        window.grecaptcha.reset(widgetId);
      }
    }
  };

  // Setup ReCAPTCHA
  const setupRecaptcha = (number) => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }

    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("Recaptcha resolved");
          },
        },
      );
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Store Firebase token to send to backend later
      updateSignupData({
        username: formData.username,
        phoneNumber: formData.phoneNumber,
        firebaseToken: idToken,
      });

      toast.success("Phone Verified!");
      setCurrentStep("final");
    } catch (error) {
      console.error("Verification Error:", error);
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep === "otp") {
      handleSendOTP();
    } else if (currentStep === "verify") {
      handleVerifyOTP();
    } else if (currentStep === "final") {
      if (formData.password !== formData.confirm_password) {
        toast.error("Passwords do not match");
        return;
      }
      updateSignupData({ password: formData.password });
      onShowPersonal();
    }
  };

  const startTimer = () => {
    setResendEnabled(false);
    setTimer(60);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setResendEnabled(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <form
      className="signupForm max-w-md mx-auto p-6 bg-white rounded-lg"
      onSubmit={handleSubmit}
    >
      <div id="recaptcha-container"></div> {/* REQUIRED FOR FIREBASE */}
      {(currentStep === "otp" || currentStep === "verify") && (
        <>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Name:</label>
            <input
              type="text"
              id="username"
              className="input-field w-full p-2.5 border rounded-lg"
              placeholder="Full Name"
              required
              value={formData.username}
              onChange={handleChange}
              disabled={currentStep === "verify"}
            />
          </div>
          <PhoneInput
            phoneNumber={formData.phoneNumber}
            validatePhoneNumber={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            phoneError={phoneError}
            disabled={currentStep === "verify"}
          />

          {currentStep === "verify" && (
            <>
              <OTPInput onChange={setOtp} />
              <p className="text-center mt-2">Resend in {timer}s</p>
              {resendEnabled && (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="block mx-auto text-orange-500 underline"
                >
                  Resend OTP
                </button>
              )}
            </>
          )}
        </>
      )}
      {currentStep === "final" && (
        <PasswordInput
          formData={formData}
          handleChange={handleChange}
          agree={true}
        />
      )}
      <div className="mt-6">
        <CustomButton type="submit" fullWidth>
          {currentStep === "otp"
            ? "Send OTP"
            : currentStep === "verify"
              ? "Verify OTP"
              : "Complete Registration"}
        </CustomButton>
        <Link
          to="/login"
          className="block text-center mt-4 text-sm text-orange-500 underline"
        >
          Already have an account?
        </Link>
      </div>
    </form>
  );
};

export default SignUpForm;
