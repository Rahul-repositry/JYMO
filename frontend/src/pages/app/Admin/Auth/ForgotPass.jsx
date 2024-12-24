import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CustomButton from "../../../../components/Button/Button";
import OTPInput from "../../User/SignIn/components/OTPInput.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../User/SignIn/components/PasswordInput.jsx";
import SelectJym from "./SelectJym.jsx";

// Main ForgotPass component
const ForgotPass = () => {
  const [formData, setFormData] = useState({
    recoveryNumber: "",
    token: "",
    jymId: "",
    password: "",
    confirm_password: "",
  });
  const [currentStatus, setCurrentStatus] = useState("Send OTP");
  const [otp, setOtp] = useState("");
  const [otpObj, setOtpObj] = useState("");
  const [error, setError] = useState({ status: false, msg: "" });
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);
  const navigate = useNavigate();
  const countdownRef = useRef(null);

  // Validate phone number format
  const validatePhoneNumber = (phoneNumber) => {
    const phonePattern = /^[6789]\d{9}$/;
    setFormData((prev) => ({ ...prev, recoveryNumber: phoneNumber }));
    if (phonePattern.test(phoneNumber)) {
      setError({ status: false, msg: "" });
      return true;
    }
    return false;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const [selectedOption, setSelectedOption] = useState(null); // Initialize with null

  // const [optionsData, setoptionsData] = useState(null);
  const [optionsData, setoptionsData] = useState([]);

  // [
  //   { name: "RPS Fitness Gym", jymUniqueId: 0 },
  //   { name: "Well Fare Gym", jymUniqueId: 1 },
  //   { name: "Speed Fitness Gym", jymUniqueId: 2 },
  // ]
  // Start timer for resending OTP
  useEffect(() => {
    if (otpObj) {
      startTimer();
    }
    return () => clearInterval(countdownRef.current); // Cleanup on component unmount
  }, [otpObj]);

  const startTimer = () => {
    setResendEnabled(false);
    setTimer(60);
    countdownRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          setResendEnabled(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle OTP resend
  const handleResendOTP = async () => {
    if (isRequestInProgress) return; // Prevent multiple requests

    if (
      !formData.recoveryNumber ||
      !validatePhoneNumber(formData.recoveryNumber)
    ) {
      setError({ status: true, msg: "Please enter a valid number" });
      return;
    }

    setIsRequestInProgress(true); // Set request in progress

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/auth/send-otp`,
        { phoneNumber: formData.recoveryNumber },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const result = response.data;
      if (result.status === "success") {
        setOtpObj(result.otp);
        toast.success("OTP Resent");
        startTimer(); // Restart the timer after resending OTP
      } else {
        setError({ status: true, msg: "Failed to resend OTP" });
      }
    } catch (error) {
      setError({ status: true, msg: "Failed to resend OTP" });
    } finally {
      setIsRequestInProgress(false); // Reset request in progress
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { recoveryNumber } = formData;

    if (!validatePhoneNumber(recoveryNumber)) {
      setError({ status: true, msg: "Please enter a valid number" });
      return;
    }

    switch (currentStatus) {
      case "Send OTP":
        await sendOTP();
        break;
      case "Verify OTP":
        await verifyOTP();
        break;
      case "Reset Password":
        await resetPassword();
        break;
      default:
        break;
    }
  };

  // Send OTP
  const sendOTP = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/auth/send-otp`,
        { phoneNumber: formData.recoveryNumber },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const result = response.data;
      if (result.status === "success") {
        setOtpObj(result.otp);
        toast.success("OTP sent");
        startTimer();
        await fetchForgotPasswordToken();
      }
    } catch (error) {
      setError({ status: true, msg: "Failed to send OTP" });
    }
  };

  // Fetch forgot password token
  const fetchForgotPasswordToken = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/auth/jym/forgotpassword`,
        { recoveryNumber: formData.recoveryNumber },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const { data } = response;
      if (data.success) {
        setoptionsData(data.jymData);
        setSelectedOption(data.jymData[0]);
        setCurrentStatus("Verify OTP");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Try again later");
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter the OTP");
      return;
    }

    setOtpObj((prev) => ({ ...prev, otp: otp }));
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/auth/verify-otp`,
        { otp, phoneNumber: formData.recoveryNumber, _id: otpObj._id },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const response2 = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/auth/jym/createsession`,
        { jymId: selectedOption._id },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const result = response.data;
      const result2 = response2.data;

      if (result.status === "success") {
        setFormData((prev) => ({
          ...prev,
          token: result2.token,
          jymId: selectedOption._id,
        }));
        setCurrentStatus("Reset Password");
        toast.success("OTP Verified");
      } else {
        toast.error("Failed to verify OTP, please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "OTP not matched");
    }
  };

  // Reset password
  const resetPassword = async () => {
    if (
      !formData.jymId ||
      !formData.token ||
      !otpObj._id ||
      !otpObj.otp ||
      !otpObj.phoneNumber
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/auth/jym/resetpassword`,
        { ...formData, otpObj },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Password reset successful");
        navigate("/admin/login");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <>
      {Object.entries(optionsData).length > 0 && (
        <div>
          <SelectJym
            options={optionsData}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
        </div>
      )}
      <form
        className="signupForm max-w-md mx-auto p-6 bg-white rounded-lg"
        onSubmit={handleSubmit}
      >
        <div className="text-customButton text-3xl my-4 font-medium text-center">
          <h2>Forgot Password</h2>
        </div>
        <label
          htmlFor="recoveryNumber"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Recovery Number:
        </label>
        {error.status && (
          <p className="mt-2 text-sm text-red-500">{error.msg}</p>
        )}

        <input
          type="text"
          id="recoveryNumber"
          className="input-field bg-gray-50 border border-orange-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full ps-10 p-2.5"
          placeholder="XXXXX-XXXXX"
          value={formData.recoveryNumber}
          onChange={handleChange}
          required
        />

        {/* OTP input for verification */}
        {otpObj && (
          <>
            <OTPInput onChange={setOtp} />
            {timer > 0 && (
              <h2 className="text-center text-customButton">
                Resend Otp in - {timer}
              </h2>
            )}
            {resendEnabled && (
              <div className="flex justify-center mt-4">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-sm text-orange-500 underline"
                  disabled={isRequestInProgress} // Disable button during request
                >
                  Resend OTP
                </button>
              </div>
            )}
          </>
        )}
        {currentStatus === "Reset Password" && (
          <PasswordInput
            formData={formData}
            handleChange={handleChange}
            agree={false}
          />
        )}
        <CustomButton type="submit">
          {currentStatus === "Send OTP"
            ? "Send OTP"
            : currentStatus === "Verify OTP"
            ? "Verify OTP"
            : "Reset Password"}
        </CustomButton>
      </form>
    </>
  );
};

export default ForgotPass;
