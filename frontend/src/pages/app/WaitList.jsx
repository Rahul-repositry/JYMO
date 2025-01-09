import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { toast } from "react-toastify";
import axios from "axios";

const WaitList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [count, setCount] = useState(20);

  useEffect(() => {
    if (location.state?.count) {
      const stateCount = location.state.count;
      setCount((prev) => prev + stateCount);
    }
  }, []);

  const submitHandler = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URI}/api/jym/register/waitlist`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      if (response.data.success) {
        toast.success("You have been added to the waitlist");
        navigate("/home");
        return;
      }
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.message || "Failed to register try again later"
      );
    }
  };

  return (
    <div className="mx-5">
      <div className="text-2xl font-semibold  text-center mb-4 mt-16">
        Join waitlist of - {count} Jyms
      </div>
      <p className=" text-center text-gray-500">
        we will soon launch it for all members. so make sure to get updated by
        registereing mail
      </p>

      <button
        className="bg-indigo-500 text-white font-medium text-sm px-4 py-2 pl-4 rounded-xl flex items-center shadow-inner hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-md transition-all relative h-11 pr-14 mx-auto my-5"
        onClick={submitHandler}
      >
        Join-today
        <div className="ml-4 absolute flex items-center justify-center h-9 w-9 rounded-lg bg-indigo-600 shadow-md right-1 transition-all">
          <svg
            height="24"
            width="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0h24v24H0z" fill="none"></path>
            <path
              d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </button>
    </div>
  );
};

export default WaitList;
