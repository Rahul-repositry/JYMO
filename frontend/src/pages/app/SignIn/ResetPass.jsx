import React, { useState } from "react";
import CustomButton from "../../../components/Button/Button";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom/dist/umd/react-router-dom.development";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ResetPass = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const token = query.get("token");
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  console.log(token);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/auth/resetpassword`,
        {
          token,
          newPassword: formData.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        toast.success("Password reset successful");
        navigate("/login");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.log(err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <form
        className="signupForm max-w-md mx-auto p-6 bg-white rounded-lg"
        onSubmit={handleSubmit}
      >
        <div className="text-customButton text-3xl my-4 font-medium  text-center">
          <h2>Reset Password</h2>
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
              className="input-field bg-gray-50 border border-orange-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5"
              placeholder="*********"
              required
              value={formData.password}
              onChange={handleChange}
              style={{ paddingRight: "50px" }}
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
            htmlFor="confirmPassword"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Confirm Password:
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              className="input-field bg-gray-50 border border-orange-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5"
              placeholder="*********"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{ paddingRight: "50px" }}
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
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <CustomButton type="submit">Submit</CustomButton>
      </form>
    </>
  );
};

export default ResetPass;
