import React, { useEffect, useState } from "react";

import BirthDate from "./components/Birthday";

import CustomButton from "../../../../components/Button/Button";
import { useSignupUserContext } from "../../../../context/context";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PersonalInfo = () => {
  const [preview, setPreview] = useState(process.env.REACT_APP_DEFAULT_IMG);
  const [signupData, updateSignupData] = useSignupUserContext();
  const [formData, setFormData] = useState({
    gender: "",
    role: "",
  });
  const navigate = useNavigate("");
  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    updateSignupData({
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { gender, role } = formData;

    updateSignupData({
      gender: gender,
      role: role,
    });

    if (!signupData.gender || !signupData.role || !signupData.birthday) {
      toast.error("Please fill out all fields");
      return;
    }
    try {
      console.log({ signupData });
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/auth/signup`,
        {
          ...signupData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.success) {
        toast.success("User Created Successfully ");
        navigate("/login");
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        let msg = err?.response?.data?.message;
        toast.error(`${msg}`);
      } else {
        toast.error("Try again later ");
      }
    }
  };

  useEffect(() => {
    if (signupData.img) {
      setPreview(() => signupData.img);
    }
    return;
  }, []);

  return (
    <div className="personalWrapper px-6">
      <div className="heading">
        <h2 className="block mt-4 mb-2 text-xl font-medium text-gray-900">
          Personal - Details
        </h2>
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="img flex justify-center pb-4 pt-2  ">
            <img
              src={preview}
              id="showImg"
              alt="Jymo user"
              name="showImg"
              referrerPolicy="no-referrer"
              style={{ boxShadow: "0px 7px 20px 0px rgba(0,0,0,.2)" }}
              className="w-[100px] h-[100px] rounded-xl border-orange-300 bg-gray-300"
            />
          </div>
          <div className="Gym mb-3">
            <h2 className="block mb-2 text-sm font-medium text-gray-900">
              Identify Yourself :
            </h2>
            <div className="radiogroup flex gap-5">
              <div className="flex items-center">
                <input
                  id="role"
                  type="radio"
                  value="user"
                  name="role"
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-customButton"
                />
                <label
                  htmlFor="role"
                  className="ms-2 text-sm font-medium text-gray-900"
                >
                  Gym - User
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="role2"
                  type="radio"
                  value="gymOwner"
                  name="role"
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-customButton"
                />
                <label
                  htmlFor="role2"
                  className="ms-2 text-sm font-medium text-gray-900"
                >
                  Gym - Owner
                </label>
              </div>
            </div>
          </div>
          <div className="gender mb-3">
            <h2 className="block mb-2 text-sm font-medium text-gray-900">
              Gender :
            </h2>
            <div className="radiogroup flex gap-5">
              <div className="flex items-center">
                <input
                  id="gender"
                  type="radio"
                  value="male"
                  name="gender"
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-customButton"
                />
                <label
                  htmlFor="gender"
                  className="ms-2 text-sm font-medium text-gray-900"
                >
                  Male
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="gender2"
                  type="radio"
                  value="female"
                  name="gender"
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-customButton"
                />
                <label
                  htmlFor="gender2"
                  className="ms-2 text-sm font-medium text-gray-900"
                >
                  Female
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="gender3"
                  type="radio"
                  value="others"
                  name="gender"
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-customButton"
                />
                <label
                  htmlFor="gender3"
                  className="ms-2 text-sm font-medium text-gray-900"
                >
                  Other
                </label>
              </div>
            </div>
          </div>
          <BirthDate handleChange={handleChange} />
          <CustomButton type="submit" fullWidth={true}>
            Submit
          </CustomButton>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfo;
