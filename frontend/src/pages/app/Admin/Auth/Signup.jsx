import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useGeolocated } from "react-geolocated";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../../components/Button/Button";
import PhoneInput from "../../User/SignIn/components/PhoneInput";
import OTPSection from "./components/OTPSection.jsx";
import LocationSelect from "./components/LocationSelect.jsx";
import PhoneNumberInput from "./components/PhoneNumberInput.jsx";
import { setObjectInLocalStorage } from "../../../../utils/helperFunc.js";
const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    geolocation: { latitude: "", longitude: "" },
    addressLocation: { country: "", state: "", city: "" },
    phoneNumbers: [""],
    subscriptionFee: "",
    recoveryNumber: "",
    otpObj: {
      _id: "",
      phoneNumber: "",
      otp: "",
    },
  });
  const [passErr, setPassErr] = useState("");
  const [otp, setOtp] = useState("");
  const [otpObj, setOtpObj] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [currentStep, setCurrentStep] = useState("submit");
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);
  const { coords } = useGeolocated({
    positionOptions: { enableHighAccuracy: false },
    userDecisionTimeout: 5000,
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (currentStep === "verify") {
      startTimer();
    }
  }, [currentStep]);

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
    if (!formData.recoveryNumber || phoneError) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/auth/send-otp`,
        { phoneNumber: formData.recoveryNumber },
        { headers: { "Content-Type": "application/json" } }
      );

      const result = response.data;

      if (result.status === "success") {
        let resultedOtp = result.otp;

        setOtpObj((prev) => ({ ...prev, ...resultedOtp }));
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

  const validatePassword = (password) => {
    if (password.length < 6) {
      // toast.error("Password must be at least 6 characters long.");
      setPassErr("Password must be at least 6 characters long.");
      return false;
    }
    setPassErr("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentStep === "submit") {
      if (!formData.recoveryNumber || phoneError) {
        toast.error("Please enter a valid phone number");
        return;
      }

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URI}/api/auth/send-otp`,
          { phoneNumber: formData.recoveryNumber },
          { headers: { "Content-Type": "application/json" } }
        );

        const result = response.data;

        if (result.status === "success") {
          let resultedOtp = result.otp;

          setOtpObj((prev) => ({ ...prev, ...resultedOtp }));
          setCurrentStep("verify");
        } else {
          setPhoneError("Failed to send OTP, please try again.");
          toast.error("Failed to send OTP, please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to send OTP, please try again.");
      }
    } else if (currentStep === "verify") {
      if (!otp || otp.length !== 6) {
        toast.error("Please enter the OTP");
        return;
      }

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URI}/api/auth/verify-otp`,
          { otp, phoneNumber: formData.recoveryNumber, _id: otpObj._id },
          { headers: { "Content-Type": "application/json" } }
        );

        const result = response.data;

        if (result.status === "success") {
          setCurrentStep("final");
          setOtpObj((prev) => ({ ...prev, otp: otp }));
          setFormData((prev) => ({ ...prev, otpObj: otpObj }));

          toast.success("OTP Verified");
        } else {
          toast.error("Failed to verify OTP, please try again.");
        }
      } catch (error) {
        let message = error?.response?.data?.message;
        if (message) {
          toast.error(message);
        } else {
          toast.error("OTP not matched");
        }
      }
    } else if (currentStep === "final") {
      if (!formData.name || !validatePassword(formData.password)) {
        toast.error("Please fill all required fields");
        return;
      }

      if (coords) {
        formData.geolocation.latitude = coords.latitude;
        formData.geolocation.longitude = coords.longitude;
      }

      try {
        setFormData((prev) => ({ ...prev, otpObj }));
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URI}/api/auth/jym/signup`,
          { ...formData, otpObj },
          {
            withCredentials: true,
          }
        );

        const { data } = response;
        if (data.success === false) {
          toast.error(data.message);
        } else {
          toast.success("Signup successful!");
          setObjectInLocalStorage("adminJym", data.jymAdmin);
          navigate(
            `/admin/login?jymUniqueId=${data.jymAdmin.jymUniqueId}&password=${formData.password}`
          );
        }
      } catch (err) {
        const msg = err?.response?.data?.message || "Signup failed. Try again.";
        toast.error(msg);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="flex flex-col px-6">
      <div className="text-customButton text-3xl my-5 font-medium text-center">
        Admin - Signup
      </div>
      <form onSubmit={handleSubmit} className="">
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Jym-name:
          </label>
          <input
            type="text"
            id="name"
            className="input-field"
            placeholder="Jym-name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Password:
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="input-field"
              placeholder="Password"
              required
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                validatePassword(e.target.value);
              }}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {passErr && (
            <p className=" text-red-400 mb-7 py-2 px-2 border border-red-400 rounded-lg">
              {passErr}
            </p>
          )}
          <div className=" flex place-items-center font-semibold text-red-400 mb-7 py-2 px-2 border border-red-400 rounded-lg">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="Layer_1"
                data-name="Layer 1"
                viewBox="0 0 24 24"
                width="25"
                height="25"
                fill="#f87171"
              >
                <path d="m22.536,8.46L15.537,1.459C14.592.515,13.337-.006,12.001-.006s-2.592.521-3.536,1.465L1.466,8.46c-1.949,1.949-1.949,5.12,0,7.069l6.999,7.001c.944.944,2.2,1.465,3.536,1.465s2.591-.521,3.536-1.465l6.999-7.001c.944-.944,1.464-2.199,1.464-3.534s-.52-2.591-1.464-3.535Zm-11.536-1.46c0-.553.448-1,1-1s1,.447,1,1v5.5c0,.553-.448,1-1,1s-1-.447-1-1v-5.5Zm1,11c-.828,0-1.5-.672-1.5-1.5s.672-1.5,1.5-1.5,1.5.672,1.5,1.5-.672,1.5-1.5,1.5Z" />
              </svg>
            </span>
            <p className="px-2 text-center">
              Remember your password otherwise you cant access your admin
              account
            </p>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="Layer_1"
                data-name="Layer 1"
                viewBox="0 0 24 24"
                width="25"
                height="25"
                fill="#f87171"
              >
                <path d="m22.536,8.46L15.537,1.459C14.592.515,13.337-.006,12.001-.006s-2.592.521-3.536,1.465L1.466,8.46c-1.949,1.949-1.949,5.12,0,7.069l6.999,7.001c.944.944,2.2,1.465,3.536,1.465s2.591-.521,3.536-1.465l6.999-7.001c.944-.944,1.464-2.199,1.464-3.534s-.52-2.591-1.464-3.535Zm-11.536-1.46c0-.553.448-1,1-1s1,.447,1,1v5.5c0,.553-.448,1-1,1s-1-.447-1-1v-5.5Zm1,11c-.828,0-1.5-.672-1.5-1.5s.672-1.5,1.5-1.5,1.5.672,1.5,1.5-.672,1.5-1.5,1.5Z" />
              </svg>
            </span>
          </div>
        </div>

        <LocationSelect
          addressLocation={formData.addressLocation}
          setFormData={setFormData}
        />

        <PhoneNumberInput
          phoneNumbers={formData.phoneNumbers}
          setFormData={setFormData}
        />

        <div>
          <label
            htmlFor="subscriptionFee"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Subscription Fee:
          </label>
          <input
            type="text"
            id="subscriptionFee"
            className="input-field"
            placeholder="0000"
            value={formData.subscriptionFee}
            onChange={(e) =>
              setFormData({ ...formData, subscriptionFee: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label
            htmlFor="recoveryNumber"
            className="block mb-2 text-gray-900 font-semibold text-xl text-center"
          >
            Account Recovery Number:
          </label>
          <PhoneInput
            phoneNumber={formData.recoveryNumber}
            validatePhoneNumber={(e) => {
              const phoneNumber = e.target.value;
              const phonePattern = /^[6789]\d{9}$/;

              setFormData((prev) => ({
                ...prev,
                recoveryNumber: phoneNumber,
              }));

              if (phonePattern.test(phoneNumber)) {
                setPhoneError("");
              } else {
                setPhoneError(
                  "Please enter a valid 10 digit Indian phone number."
                );
              }
            }}
            phoneError={phoneError}
          />
        </div>
        <div className=" flex place-items-center  text-red-400 mb-7 py-2 px-2 border border-red-400 rounded-lg">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="Layer_1"
              data-name="Layer 1"
              viewBox="0 0 24 24"
              width="25"
              height="25"
              fill="#f87171"
            >
              <path d="m22.536,8.46L15.537,1.459C14.592.515,13.337-.006,12.001-.006s-2.592.521-3.536,1.465L1.466,8.46c-1.949,1.949-1.949,5.12,0,7.069l6.999,7.001c.944.944,2.2,1.465,3.536,1.465s2.591-.521,3.536-1.465l6.999-7.001c.944-.944,1.464-2.199,1.464-3.534s-.52-2.591-1.464-3.535Zm-11.536-1.46c0-.553.448-1,1-1s1,.447,1,1v5.5c0,.553-.448,1-1,1s-1-.447-1-1v-5.5Zm1,11c-.828,0-1.5-.672-1.5-1.5s.672-1.5,1.5-1.5,1.5.672,1.5,1.5-.672,1.5-1.5,1.5Z" />
            </svg>
          </span>
          <p className="px-2 text-center font-semibold">
            Remember your recovery-number otherwise you cant recover your admin
            account
          </p>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="Layer_1"
              data-name="Layer 1"
              viewBox="0 0 24 24"
              width="25"
              height="25"
              fill="#f87171"
            >
              <path d="m22.536,8.46L15.537,1.459C14.592.515,13.337-.006,12.001-.006s-2.592.521-3.536,1.465L1.466,8.46c-1.949,1.949-1.949,5.12,0,7.069l6.999,7.001c.944.944,2.2,1.465,3.536,1.465s2.591-.521,3.536-1.465l6.999-7.001c.944-.944,1.464-2.199,1.464-3.534s-.52-2.591-1.464-3.535Zm-11.536-1.46c0-.553.448-1,1-1s1,.447,1,1v5.5c0,.553-.448,1-1,1s-1-.447-1-1v-5.5Zm1,11c-.828,0-1.5-.672-1.5-1.5s.672-1.5,1.5-1.5,1.5.672,1.5,1.5-.672,1.5-1.5,1.5Z" />
            </svg>
          </span>
        </div>
        {currentStep === "verify" && (
          <OTPSection
            otp={otp}
            setOtp={setOtp}
            handleResendOTP={handleResendOTP}
            timer={timer}
            resendEnabled={resendEnabled}
          />
        )}

        <CustomButton type="submit" fullWidth className="btn-primary">
          {currentStep === "submit"
            ? "Send OTP"
            : currentStep === "verify"
            ? "Verify OTP"
            : "Signup"}
        </CustomButton>
      </form>
    </div>
  );
};

export default SignupForm;
