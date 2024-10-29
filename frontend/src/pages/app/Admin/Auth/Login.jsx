import React, { useEffect, useState } from "react";
import CustomButton from "../../../../components/Button/Button";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAdmin } from "../../../../redux/slices/admin.slice";
import { getQueryParams } from "../../../../utils/helperFunc";
const LogIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [formData, setFormData] = useState({
    jymUniqueId: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/auth/jym/signin`,
        formData,
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
        dispatch(setAdmin(data.jymAdmin));

        navigate(`/admin/home`);
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

    setFormData({
      jymUniqueId: "",
      password: "",
    });
  };

  useEffect(() => {
    const queryParams = getQueryParams(location.search);
    const jymUniqueId = queryParams.get("jymUniqueId");
    const password = queryParams.get("password");

    if (jymUniqueId && password) {
      console.log("is running");
      setFormData((prev) => ({
        ...prev,
        jymUniqueId: jymUniqueId,
        password: password,
      }));
      setShowPassword(true);
    }
  }, []);

  return (
    <>
      <form
        className="signupForm max-w-md mx-auto p-6 bg-white rounded-lg"
        onSubmit={handleSubmit}
      >
        <div className="text-customButton text-3xl my-4 font-medium  text-center">
          Admin - Login
        </div>
        <div className=" flex flex-col place-items-center font-semibold text-red-400 mb-7 py-3 px-2 border border-red-400 rounded-lg">
          <div className="flex gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="Layer_1"
              data-name="Layer 1"
              viewBox="0 0 24 24"
              width="25"
              height="25"
              fill="#f87171"
            >
              <path d="m22.536,8.46L15.537,1.459C14.592.515,13.337-.006,12.001-.006s-2.592.521-3.536,1.465L1.466,8.46c-1.949,1.949-1.949,5.12,0,7.069l6.999,7.001c.944.944,2.2,1.465,3.536,1.465s2.591-.521,3.536-1.465l6.999-7.001c.944-.944,1.464-2.199,1.464-3.534s-.52-2.591-1.464-3.535Zm-11.536-1.46c0-.553.448-1,1-1s1,.447,1,1v5.5c0,.553-.448,1-1,1s-1-.447-1-1v-5.5Zm1,11c-.828,0-1.5-.672-1.5-1.5s.672-1.5,1.5-1.5,1.5.672,1.5,1.5-.672,1.5-1.5,1.5Z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="Layer_1"
              data-name="Layer 1"
              viewBox="0 0 24 24"
              width="25"
              height="25"
              fill="#f87171"
            >
              <path d="m22.536,8.46L15.537,1.459C14.592.515,13.337-.006,12.001-.006s-2.592.521-3.536,1.465L1.466,8.46c-1.949,1.949-1.949,5.12,0,7.069l6.999,7.001c.944.944,2.2,1.465,3.536,1.465s2.591-.521,3.536-1.465l6.999-7.001c.944-.944,1.464-2.199,1.464-3.534s-.52-2.591-1.464-3.535Zm-11.536-1.46c0-.553.448-1,1-1s1,.447,1,1v5.5c0,.553-.448,1-1,1s-1-.447-1-1v-5.5Zm1,11c-.828,0-1.5-.672-1.5-1.5s.672-1.5,1.5-1.5,1.5.672,1.5,1.5-.672,1.5-1.5,1.5Z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="Layer_1"
              data-name="Layer 1"
              viewBox="0 0 24 24"
              width="25"
              height="25"
              fill="#f87171"
            >
              <path d="m22.536,8.46L15.537,1.459C14.592.515,13.337-.006,12.001-.006s-2.592.521-3.536,1.465L1.466,8.46c-1.949,1.949-1.949,5.12,0,7.069l6.999,7.001c.944.944,2.2,1.465,3.536,1.465s2.591-.521,3.536-1.465l6.999-7.001c.944-.944,1.464-2.199,1.464-3.534s-.52-2.591-1.464-3.535Zm-11.536-1.46c0-.553.448-1,1-1s1,.447,1,1v5.5c0,.553-.448,1-1,1s-1-.447-1-1v-5.5Zm1,11c-.828,0-1.5-.672-1.5-1.5s.672-1.5,1.5-1.5,1.5.672,1.5,1.5-.672,1.5-1.5,1.5Z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="Layer_1"
              data-name="Layer 1"
              viewBox="0 0 24 24"
              width="25"
              height="25"
              fill="#f87171"
            >
              <path d="m22.536,8.46L15.537,1.459C14.592.515,13.337-.006,12.001-.006s-2.592.521-3.536,1.465L1.466,8.46c-1.949,1.949-1.949,5.12,0,7.069l6.999,7.001c.944.944,2.2,1.465,3.536,1.465s2.591-.521,3.536-1.465l6.999-7.001c.944-.944,1.464-2.199,1.464-3.534s-.52-2.591-1.464-3.535Zm-11.536-1.46c0-.553.448-1,1-1s1,.447,1,1v5.5c0,.553-.448,1-1,1s-1-.447-1-1v-5.5Zm1,11c-.828,0-1.5-.672-1.5-1.5s.672-1.5,1.5-1.5,1.5.672,1.5,1.5-.672,1.5-1.5,1.5Z" />
            </svg>
          </div>
          <p className=" text-center py-3">
            Remember Or take a screenshot of your Jym Id and password to access
            you Jym dashboard Account.
          </p>
          <div className="flex gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="Layer_1"
              data-name="Layer 1"
              viewBox="0 0 24 24"
              width="25"
              height="25"
              fill="#f87171"
            >
              <path d="m22.536,8.46L15.537,1.459C14.592.515,13.337-.006,12.001-.006s-2.592.521-3.536,1.465L1.466,8.46c-1.949,1.949-1.949,5.12,0,7.069l6.999,7.001c.944.944,2.2,1.465,3.536,1.465s2.591-.521,3.536-1.465l6.999-7.001c.944-.944,1.464-2.199,1.464-3.534s-.52-2.591-1.464-3.535Zm-11.536-1.46c0-.553.448-1,1-1s1,.447,1,1v5.5c0,.553-.448,1-1,1s-1-.447-1-1v-5.5Zm1,11c-.828,0-1.5-.672-1.5-1.5s.672-1.5,1.5-1.5,1.5.672,1.5,1.5-.672,1.5-1.5,1.5Z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="Layer_1"
              data-name="Layer 1"
              viewBox="0 0 24 24"
              width="25"
              height="25"
              fill="#f87171"
            >
              <path d="m22.536,8.46L15.537,1.459C14.592.515,13.337-.006,12.001-.006s-2.592.521-3.536,1.465L1.466,8.46c-1.949,1.949-1.949,5.12,0,7.069l6.999,7.001c.944.944,2.2,1.465,3.536,1.465s2.591-.521,3.536-1.465l6.999-7.001c.944-.944,1.464-2.199,1.464-3.534s-.52-2.591-1.464-3.535Zm-11.536-1.46c0-.553.448-1,1-1s1,.447,1,1v5.5c0,.553-.448,1-1,1s-1-.447-1-1v-5.5Zm1,11c-.828,0-1.5-.672-1.5-1.5s.672-1.5,1.5-1.5,1.5.672,1.5,1.5-.672,1.5-1.5,1.5Z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="Layer_1"
              data-name="Layer 1"
              viewBox="0 0 24 24"
              width="25"
              height="25"
              fill="#f87171"
            >
              <path d="m22.536,8.46L15.537,1.459C14.592.515,13.337-.006,12.001-.006s-2.592.521-3.536,1.465L1.466,8.46c-1.949,1.949-1.949,5.12,0,7.069l6.999,7.001c.944.944,2.2,1.465,3.536,1.465s2.591-.521,3.536-1.465l6.999-7.001c.944-.944,1.464-2.199,1.464-3.534s-.52-2.591-1.464-3.535Zm-11.536-1.46c0-.553.448-1,1-1s1,.447,1,1v5.5c0,.553-.448,1-1,1s-1-.447-1-1v-5.5Zm1,11c-.828,0-1.5-.672-1.5-1.5s.672-1.5,1.5-1.5,1.5.672,1.5,1.5-.672,1.5-1.5,1.5Z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="Layer_1"
              data-name="Layer 1"
              viewBox="0 0 24 24"
              width="25"
              height="25"
              fill="#f87171"
            >
              <path d="m22.536,8.46L15.537,1.459C14.592.515,13.337-.006,12.001-.006s-2.592.521-3.536,1.465L1.466,8.46c-1.949,1.949-1.949,5.12,0,7.069l6.999,7.001c.944.944,2.2,1.465,3.536,1.465s2.591-.521,3.536-1.465l6.999-7.001c.944-.944,1.464-2.199,1.464-3.534s-.52-2.591-1.464-3.535Zm-11.536-1.46c0-.553.448-1,1-1s1,.447,1,1v5.5c0,.553-.448,1-1,1s-1-.447-1-1v-5.5Zm1,11c-.828,0-1.5-.672-1.5-1.5s.672-1.5,1.5-1.5,1.5.672,1.5,1.5-.672,1.5-1.5,1.5Z" />
            </svg>
          </div>
        </div>
        <div className="jymUniqueId">
          <label
            htmlFor="jymUniqueId"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Jym Id:
          </label>
          <div className="relative">
            <input
              type="text"
              id="jymUniqueId"
              aria-describedby="helper-text-explanation"
              className="input-field bg-gray-50 border border-orange-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full ps-10 p-2.5"
              placeholder="00"
              value={formData.jymUniqueId}
              onChange={handleChange}
              required
            />
          </div>
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

        <div className="flex justify-between flex-wrap gap-4">
          <Link
            to="/admin/signup"
            className="text-sm text-orange-500 underline  -translate-y-2"
          >
            Register your jym ?
          </Link>
          <Link
            to="/admin/forgotpassword"
            className="text-sm text-orange-500 underline  -translate-y-2"
          >
            Forgot Password ?
          </Link>
        </div>

        <CustomButton type="submit">Submit</CustomButton>
      </form>
    </>
  );
};

export default LogIn;
