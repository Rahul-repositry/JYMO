import React, { useState } from "react";
import axios from "axios";
import PhoneInput from "../SignIn/components/PhoneInput";
import OTPInput from "../SignIn/components/OTPInput";
import { toast } from "react-toastify";

const UpdatePhone = () => {
  const [data, setData] = useState({
    phoneNumber: "",
    otp: "",
    idToken: "",
  });

  const [phoneError, setPhoneError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validating Phone Number
  const validatePhoneNumber = (e) => {
    const value = e.target.value;
    const isValid = /^[6789][0-9]{9}$/.test(value);
    setData((prev) => ({ ...prev, phoneNumber: value }));
    setPhoneError(isValid ? "" : "Invalid phone number");
  };

  // Sending OTP and getting idToken
  const sendOtp = async () => {
    if (phoneError || !data.phoneNumber) {
      return toast.error("Please enter a valid phone number");
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/auth/send-otp`,
        { phoneNumber: data.phoneNumber },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setLoading(false);
      if (response.data.success) {
        setOtpSent(true);
        toast.success("OTP sent successfully");
        setData((prev) => ({
          ...prev,
          idToken: response.data.idToken, // Store idToken received from the response
        }));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error sending OTP. Please try again.");
    }
  };

  // Verifying OTP and updating phone number
  const verifyOtpAndUpdatePhone = async () => {
    if (data.otp.length !== 6) {
      return toast.error("Please enter the 6-digit OTP");
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/user/updatephone`,
        {
          phoneNumber: data.phoneNumber,
          otp: data.otp, // OTP entered by the user
          idToken: data.idToken, // idToken from sendOtp response
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setLoading(false);
      if (response.data.success) {
        toast.success("Phone number updated successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to update phone number. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold m-4">Update Phone Number</h2>

      <PhoneInput
        phoneNumber={data.phoneNumber}
        validatePhoneNumber={validatePhoneNumber}
        phoneError={phoneError}
      />

      {otpSent && (
        <OTPInput
          onChange={(value) => setData((prev) => ({ ...prev, otp: value }))}
        />
      )}

      {!otpSent ? (
        <button
          onClick={sendOtp}
          className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg"
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      ) : (
        <button
          onClick={verifyOtpAndUpdatePhone}
          className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg"
          disabled={loading}
        >
          {loading ? "Updating..." : "Verify OTP & Update"}
        </button>
      )}
    </div>
  );
};

export default UpdatePhone;
