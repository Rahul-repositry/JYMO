import React, { useState } from "react";
import { useSignupUserContext } from "../../../context/context";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Gauth from "../../../components/Gauth/Gauth";
import CustomButton from "../../../components/Button/Button";
import PhoneInput from "./components/PhoneInput.jsx";
import PasswordInput from "./components/PasswordInput.jsx";
import { Link } from "react-router-dom";
import axios from "axios";
import OTPInput from "./components/OTPInput.jsx";
import "./signup.css";

const SignUpForm = ({ onShowPersonal }) => {
  const [signupData, updateSignupData] = useSignupUserContext();
  const [otp, setOtp] = useState("");
  const [mailError, setMailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [idToken, setIdToken] = useState("");
  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
    phoneNumber: "",
    remember: false,
  });
  const [currentStep, setCurrentStep] = useState("submit");
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);

  const validatePhoneNumber = (e) => {
    const phoneNumber = e.target.value;
    const phonePattern = /^[6789]\d{9}$/;

    setFormData((prev) => ({ ...prev, phoneNumber: phoneNumber }));

    if (phonePattern.test(phoneNumber)) {
      setPhoneError("");
    } else {
      setPhoneError("Please enter a valid 10 digit Indian phone number.");
    }
  };

  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const startTimer = () => {
    setResendEnabled(false);
    setTimer(60);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdown);
          setResendEnabled(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOTP = async () => {
    const phoneNumber = formData.phoneNumber;
    if (!phoneNumber || phoneError) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/auth/send-otp`,
        { phoneNumber },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await response.data;

      if (result.status === "success") {
        toast.success("OTP Resent");
        startTimer();
      } else {
        toast.error("Failed to resend OTP, please try again.");
      }
    } catch (error) {
      toast.error("Please login after sometime");
      console.error("Error:", error);
    }
  };

  const updateData = async (e) => {
    e.preventDefault();

    if (currentStep === "submit") {
      if (!signupData.email) {
        setMailError("Register your Gmail with Google");
        toast.error("Register your Gmail with Google");
        return;
      } else {
        setCurrentStep("verify");
      }
    } else if (currentStep === "verify") {
      const phoneNumber = formData.phoneNumber;
      if (!phoneNumber || phoneError) {
        toast.error("Please enter a valid phone number");
        return;
      }

      try {
        //*****
        // setCurrentStep("otp");
        // startTimer();
        //******/

        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URI}/api/auth/send-otp`,
          { phoneNumber },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const result = await response.data;

        if (result.status === "success") {
          setIdToken(result.idToken);
          setCurrentStep("otp");
          startTimer();
        } else {
          setPhoneError("Failed to send OTP, please try again.");
          toast.error("Failed to send OTP, please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to send OTP, please try again.");
      }
    } else if (currentStep === "otp") {
      if (!otp) {
        toast.error("Please enter the OTP");
        return;
      }

      try {
        ///^^^^^^ just for test/
        // setCurrentStep("final");
        // toast.success("OTP Verified");

        ///*&*&*()

        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URI}/api/auth/verify-otp`,
          { otp, phoneNumber: formData.phoneNumber, idToken },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const result = await response.data;

        if (result.status === "success") {
          setCurrentStep("final");
          toast.success("OTP Verified");
        } else {
          toast.error("Failed to verify OTP, please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else if (currentStep === "final") {
      if (formData.password !== formData.confirm_password) {
        toast.error("Passwords do not match");
        return;
      }

      updateSignupData({
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      });

      onShowPersonal();
    }
  };

  return (
    <form
      className="signupForm max-w-md mx-auto p-6 bg-white rounded-lg "
      onSubmit={updateData}
    >
      {signupData.email === "" ? (
        <>
          {mailError && <p className="text-red-500">{mailError}</p>}
          <Gauth />
        </>
      ) : (
        <p className="text-green-600 -translate-y-5">Gmail is Registered</p>
      )}

      {(currentStep === "verify" || "otp") && (
        <>
          <PhoneInput
            phoneNumber={formData.phoneNumber}
            validatePhoneNumber={validatePhoneNumber}
            phoneError={phoneError}
          />

          <OTPInput onChange={setOtp} />
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={!resendEnabled}
              className={`text-sm text-orange-500 hover:underline ${
                !resendEnabled ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {resendEnabled ? "Resend OTP" : `Resend OTP in ${timer}s`}
            </button>
          </div>
        </>
      )}

      {currentStep === "final" && (
        <PasswordInput formData={formData} handleChange={handleChange} />
      )}

      <div className="flex flex-col items-center justify-between">
        <Link
          to="/login"
          className="text-sm text-orange-500 hover:underline translate-y-3"
        >
          Already have an account?
        </Link>
        <CustomButton type="submit" fullWidth>
          {currentStep === "submit"
            ? "Submit"
            : currentStep === "verify"
            ? "Send OTP"
            : currentStep === "otp"
            ? "Verify OTP"
            : "Submit"}
        </CustomButton>
      </div>
    </form>
  );
};

export default SignUpForm;
