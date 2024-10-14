// components/PasswordInput.js
import React from "react";

const PasswordInput = ({ formData, handleChange, agree }) => (
  <>
    <div>
      <label
        htmlFor="password"
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        Password :
      </label>
      <input
        type="password"
        id="password"
        className="input-field bg-gray-50 border border-orange-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5"
        placeholder="*********"
        required
        value={formData.password}
        onChange={handleChange}
      />
    </div>
    <div>
      <label
        htmlFor="confirm_password"
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        Confirm Password :
      </label>
      <input
        type="password"
        id="confirm_password"
        className="input-field bg-gray-50 border border-orange-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5"
        placeholder="*********"
        required
        value={formData.confirm_password}
        onChange={handleChange}
      />
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
          I agree with the{" "}
          <a href="/" className="text-orange-500 hover:underline">
            terms and conditions
          </a>
          .
        </label>
      </div>
    )}
  </>
);

export default PasswordInput;
