// components/PasswordInput.js
import React, { useState } from "react";
import { Link } from "react-router";

const PasswordInput = ({ formData, handleChange, agree }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  return (
    <>
      <div>
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Password :
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className="input-field bg-gray-50 border border-orange-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5"
            placeholder="*********"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <div>
        <label
          htmlFor="confirm_password"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Confirm Password :
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="confirm_password"
            className="input-field bg-gray-50 border border-orange-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5"
            placeholder="*********"
            required
            value={formData.confirm_password}
            onChange={handleChange}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      {agree && (
        <div className="flex items-start mb-6">
          <div className="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              checked={formData.remember}
              onChange={handleChange}
              className="input-field w-4 h-4 border border-orange-300 rounded bg-gray-50 focus:ring-3 focus:ring-orange-500"
              required
            />
          </div>

          <label
            htmlFor="remember"
            className="ml-2 text-sm font-medium text-gray-900"
          >
            I agree with the &nbsp;
            <Link
              to="/termscondition"
              className="text-orange-500 hover:underline"
            >
              terms and conditions.
            </Link>
          </label>
        </div>
      )}
    </>
  );
};

export default PasswordInput;
