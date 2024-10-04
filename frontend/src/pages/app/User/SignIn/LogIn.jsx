import React, { useState } from "react";
import Gauth from "../../../../components/Gauth/Gauth";
import { SignupUserDataProvider } from "../../../../context/context";
import CustomButton from "../../../../components/Button/Button";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setObjectInLocalStorage } from "../../../../utils/helperFunc";

const LogIn = () => {
  const [error, setError] = useState({
    status: false,
    msg: undefined,
  });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    numberOrGmail: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const validateInput = (e) => {
    const input = formData.numberOrGmail;
    const phonePattern = /^[6789]\d{9}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      input.includes("@") ||
      input.includes("gmail") ||
      input.includes("." || input.includes("com"))
    ) {
      if (emailPattern.test(input)) {
        setError({ status: false, msg: "" });
        return true;
      } else {
        setError({ status: true, msg: "Please type a valid gmail" });
        return false;
      }
    }

    if (phonePattern.test(input)) {
      setError({ status: false, msg: "" });
      return true;
    } else {
      setError({
        status: true,
        msg: "Please enter a valid 10 digit Indian phone number or a valid email address.",
      });
      return false;
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateInput();

    if (isValid) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URI}/api/auth/login`,
          {
            numberOrGmail: formData.numberOrGmail,
            password: formData.password,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        const { data } = response;
        if (data.success === false) {
          toast.error(`${data.message}`);
        } else {
          toast.success("Login successful!");
          // Add navigation to the dashboard or home page if needed
          setObjectInLocalStorage("user", data.user);

          navigate("/home");
          return;
        }
      } catch (err) {
        if (err?.response?.data?.message) {
          let msg = err?.response?.data?.message;
          toast.error(`${msg}`);
          console.log("err", msg);
        } else {
          toast.error("Login failed. Try with Google.");
          console.log("Err", err);
        }
      }
    }
    setFormData({
      numberOrGmail: "",
      password: "",
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <SignupUserDataProvider>
        <form
          className="signupForm max-w-md mx-auto p-6 bg-white rounded-lg"
          onSubmit={handleSubmit}
        >
          <div className="text-customButton text-3xl my-4 font-medium  text-center">
            Login
          </div>
          <div className="phone">
            <label
              htmlFor="numberOrGmail"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Phone OR Gmail:
            </label>
            <div className="relative">
              <input
                type="text"
                id="numberOrGmail"
                aria-describedby="helper-text-explanation"
                className="input-field bg-gray-50 border border-orange-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full ps-10 p-2.5"
                placeholder="Number or Gmail"
                value={formData.numberOrGmail}
                onChange={handleChange}
                required
              />
            </div>
            {error.status && (
              <p className="mt-2 text-sm text-red-500">{error.msg}</p>
            )}
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
                style={{ paddingRight: "50px" }}
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
          <Gauth />
          <div className="flex justify-between flex-wrap gap-4">
            <Link
              to="/signup"
              className="text-sm text-orange-500 underline  -translate-y-2"
            >
              Register yourself with Signup ?
            </Link>
            <Link
              to="/forgotpassword"
              className="text-sm text-orange-500 underline  -translate-y-2"
            >
              Forgot Password ?
            </Link>
          </div>

          <CustomButton type="submit">Submit</CustomButton>
        </form>
      </SignupUserDataProvider>
    </>
  );
};

export default LogIn;
