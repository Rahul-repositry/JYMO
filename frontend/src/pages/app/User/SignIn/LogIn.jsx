import React, { useState } from "react";
// import Gauth from "../../../../components/Gauth/Gauth";
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
    number: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // Demo user credentials
  const DEMO_USER = {
    number: "9877434656",
    password: "rahul123",
  };

  const validateInput = (e) => {
    const input = formData.number;
    const phonePattern = /^[6789]\d{9}$/;
    // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // if (
    //   input.includes("@") ||
    //   input.includes("gmail") ||
    //   input.includes("." || input.includes("com"))
    // ) {
    //   if (emailPattern.test(input)) {
    //     setError({ status: false, msg: "" });
    //     return true;
    //   } else {
    //     setError({ status: true, msg: "Please type a valid gmail" });
    //     return false;
    //   }
    // }

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
            number: formData.number,
            password: formData.password,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          },
        );

        const { data } = response;
        if (data.success === false) {
          toast.error(`${data.message}`);
        } else {
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
      number: "",
      password: "",
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleDemoLogin = () => {
    setFormData({
      number: DEMO_USER.number,
      password: DEMO_USER.password,
    });
    // Optional: Automatically submit the form after a short delay
    // setTimeout(() => {
    //   document.querySelector('form').dispatchEvent(
    //     new Event('submit', { cancelable: true, bubbles: true })
    //   );
    // }, 100);
  };

  return (
    <>
      <SignupUserDataProvider>
        <form
          className="signupForm max-w-md mx-auto p-6 bg-white rounded-lg"
          onSubmit={handleSubmit}
        >
          <div className="text-customButton text-3xl my-4 font-medium text-center">
            Login
          </div>

          {/* Demo User Button */}
          <div className="mb-4">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              Try Demo Account
            </button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or login with your credentials
              </span>
            </div>
          </div>

          <div className="phone">
            <label
              htmlFor="number"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Phone:
            </label>
            <div className="relative">
              <input
                type="text"
                id="number"
                aria-describedby="helper-text-explanation"
                className="input-field "
                placeholder="Number"
                value={formData.number}
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
          {/* <Gauth /> */}
          <div className="flex justify-between flex-wrap gap-4">
            <Link
              to="/signup"
              className="text-sm text-orange-500 underline -translate-y-2"
            >
              Register yourself with Signup ?
            </Link>
            <Link
              to="/forgotpassword"
              className="text-sm text-orange-500 underline -translate-y-2"
            >
              Forgot Password ?
            </Link>
          </div>

          <CustomButton type="submit" fullWidth={true}>
            Submit
          </CustomButton>
        </form>
      </SignupUserDataProvider>
    </>
  );
};

export default LogIn;
