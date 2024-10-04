// src/components/OTPInput/OTPInput.js
import React, { useState, useRef } from "react";

const OTPInput = ({ onChange }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputs = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    onChange(newOtp.join(""));

    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <div className="flex space-x-2">
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          className="w-10 h-10 text-center border border-gray-300 rounded mb-5 focus:ring-orange-500 focus:border-orange-500"
          maxLength="1"
          ref={(el) => (inputs.current[index] = el)}
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}
    </div>
  );
};

export default OTPInput;
