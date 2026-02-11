// SignupForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useGeolocated } from "react-geolocated";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../../components/Button/Button.jsx";
import PhoneInput from "../../User/SignIn/components/PhoneInput.jsx";
import OTPSection from "./components/OTPSection.jsx";
import LocationSelect from "./components/LocationSelect.jsx";
import PhoneNumberInput from "./components/PhoneNumberInput.jsx";
import { setObjectInLocalStorage } from "../../../../utils/helperFunc.js";
import { firebaseOTPService } from "./services/firebaseOTP.js";

const SignupForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("submit"); // steps: submit -> verify -> final
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    recoveryNumber: "",
    subscriptionFee: "",
    phoneNumbers: [""],
    addressLocation: { country: "", state: "", city: "" },
    geolocation: { latitude: "", longitude: "" },
  });

  const [otp, setOtp] = useState("");
  const [firebaseIdToken, setFirebaseIdToken] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passErr, setPassErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);

  const { coords } = useGeolocated({
    positionOptions: { enableHighAccuracy: false },
    userDecisionTimeout: 5000,
  });

  useEffect(() => {
    let interval;
    if (currentStep === "verify" && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setResendEnabled(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [currentStep, timer]);

  const handleSendOTP = async () => {
    if (!formData.recoveryNumber || phoneError) {
      return toast.error("Please enter a valid phone number");
    }
    setLoading(true);
    try {
      await firebaseOTPService.sendOTP(formData.recoveryNumber);
      toast.success("OTP sent to " + formData.recoveryNumber);
      setCurrentStep("verify");
      setTimer(60);
      setResendEnabled(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return toast.error("Enter 6-digit OTP");
    setLoading(true);
    try {
      const result = await firebaseOTPService.verifyOTP(otp);
      setFirebaseIdToken(result.idToken);
      setCurrentStep("final");
      toast.success("Identity Verified");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || formData.password.length < 6) {
      return toast.error("Please fill all required fields correctly");
    }

    setLoading(true);
    const finalData = {
      ...formData,
      firebaseIdToken, // Passing this to backend instead of local OTP obj
      geolocation: coords
        ? { latitude: coords.latitude, longitude: coords.longitude }
        : formData.geolocation,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/auth/jym/signup`,
        finalData,
        { withCredentials: true },
      );

      if (response.data.success) {
        toast.success("Account Created!");
        setObjectInLocalStorage("adminJym", response.data.user);
        navigate(`/admin/dashboard`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "submit":
        return (
          <div className="space-y-4">
            <label className="block text-gray-900 font-semibold text-xl text-center">
              Account Recovery Number:
            </label>
            <PhoneInput
              phoneNumber={formData.recoveryNumber}
              validatePhoneNumber={(e) => {
                const val = e.target.value;
                setFormData({ ...formData, recoveryNumber: val });
                setPhoneError(
                  /^[6789]\d{9}$/.test(val) ? "" : "Invalid Indian Number",
                );
              }}
              phoneError={phoneError}
            />
            <CustomButton
              onClick={handleSendOTP}
              disabled={loading}
              fullWidth
              className="btn-primary"
            >
              {loading ? "Sending..." : "Send OTP"}
            </CustomButton>
          </div>
        );
      case "verify":
        return (
          <div className="space-y-4">
            <OTPSection
              otp={otp}
              setOtp={setOtp}
              handleResendOTP={handleSendOTP}
              timer={timer}
              resendEnabled={resendEnabled}
            />
            <CustomButton
              onClick={handleVerifyOTP}
              disabled={loading}
              fullWidth
              className="btn-primary"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </CustomButton>
          </div>
        );
      case "final":
        return (
          <div className="space-y-4">
            <input
              type="text"
              className="input-field"
              placeholder="Jym Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="input-field"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                className="absolute right-3 top-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <LocationSelect
              addressLocation={formData.addressLocation}
              setFormData={setFormData}
            />
            <PhoneNumberInput
              phoneNumbers={formData.phoneNumbers}
              setFormData={setFormData}
            />
            <input
              type="text"
              className="input-field"
              placeholder="Subscription Fee"
              value={formData.subscriptionFee}
              onChange={(e) =>
                setFormData({ ...formData, subscriptionFee: e.target.value })
              }
            />
            <CustomButton
              onClick={handleFinalSubmit}
              disabled={loading}
              fullWidth
              className="btn-primary"
            >
              {loading ? "Processing..." : "Complete Signup"}
            </CustomButton>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col px-6 pb-10">
      <div className="text-customButton text-3xl my-5 font-medium text-center">
        Admin - Signup
      </div>
      {renderStep()}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default SignupForm;
