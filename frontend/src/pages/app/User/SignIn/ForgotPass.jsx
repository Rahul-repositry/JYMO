import React, { useState } from "react";
import axios from "axios";
import CustomButton from "../../../../components/Button/Button";
import { toast } from "react-toastify";

const ForgotPass = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState({
    status: false,
    msg: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email } = formData;

    if (!validateEmail(email)) {
      setError({ status: true, msg: "Please enter a valid email address" });
      return;
    }

    setError({ status: false, msg: "" });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/auth/forgotpassword`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { data } = response;
      if (data.success) {
        toast.success("Password reset email sent successfully!");
        setMessage(
          " A mail through 'jyymmoo@gmail.com' containing  reset link is send . Chq Inbox "
        );
      } else {
        setError({ status: true, msg: data.message || "Error sending email" });
      }
    } catch (error) {
      setError({ status: true, msg: "Error sending email" });
    }
  };

  return (
    <>
      <form
        className="signupForm max-w-md mx-auto p-6 bg-white rounded-lg"
        onSubmit={handleSubmit}
      >
        <div className="text-customButton text-3xl my-4 font-medium  text-center">
          <h2>Forgot Password</h2>
        </div>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Email:
        </label>
        {error.status && (
          <p className="mt-2 text-sm text-red-500">{error.msg}</p>
        )}
        {message && <p className="mt-2 text-sm  text-green-500">{message}</p>}
        <input
          type="email"
          id="email"
          aria-describedby="helper-text-explanation"
          className="input-field bg-gray-50 border border-orange-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full ps-10 p-2.5"
          placeholder="Gmail"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <CustomButton type="submit">Submit</CustomButton>
      </form>
    </>
  );
};

export default ForgotPass;
