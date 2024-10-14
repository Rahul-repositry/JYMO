import React from "react";
import OTPInput from "../../../User/SignIn/components/OTPInput";

const OTPSection = ({ otp, setOtp, handleResendOTP, timer, resendEnabled }) => {
  return (
    <>
      <OTPInput onChange={setOtp} />
      <h2 className="text-center text-customButton">Resend Otp in - {timer}</h2>

      {resendEnabled && (
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={handleResendOTP}
            className="text-sm text-orange-500 underline"
          >
            Resend OTP
          </button>
        </div>
      )}
    </>
  );
};

export default OTPSection;
