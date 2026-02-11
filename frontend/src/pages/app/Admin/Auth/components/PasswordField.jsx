import React from "react";
import WarningMessage from "./WarningMessage";

const PasswordField = ({
  password,
  setPassword,
  showPassword,
  togglePasswordVisibility,
  validatePassword,
  passErr,
}) => {
  return (
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
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
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
        <p className="text-red-400 mb-2 py-2 px-2 border border-red-400 rounded-lg">
          {passErr}
        </p>
      )}
      <WarningMessage message="Remember your password otherwise you can't access your admin account" />
    </div>
  );
};

export default PasswordField;
