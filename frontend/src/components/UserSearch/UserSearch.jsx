import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserSearch = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    setSearch(() => e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!search) {
      toast.error("Enter User number or UID to search.");
      return;
    }

    if (!/^\d+$/.test(search)) {
      toast.error(
        "Invalid user details. Please enter a valid UID or phone number."
      );
      return;
    }

    try {
      let route;

      if (search.length <= 6) {
        route = `${process.env.REACT_APP_BACKEND_URI}/api/user/useruniqueid/${search}`;
      } else if (search.length === 10) {
        route = `${process.env.REACT_APP_BACKEND_URI}/api/user/userphonenumber/${search}`;
      } else {
        toast.error(
          "Invalid user detail. Please enter a valid UID or phone number."
        );
        return;
      }

      const response = await axios.get(route, { withCredentials: true });

      if (response.data.success) {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URI}/api/jym/getuserbysearch/${response.data.user._id}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          navigate("/admin/users", {
            state: { initialUserData: [res.data.data] },
          });

          return;
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Enter a valid UID or Phone-number !!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="search py-4">
        <div className="relative">
          <input
            type="text"
            id="search"
            className="input-field bg-gray-50 !m-0 border border-orange-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500  w-full p-2.5"
            placeholder="UId or Phone Number"
            style={{ paddingRight: "50px" }}
            value={search}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
          >
            <svg
              fill="currentColor"
              className="text-darkBlack"
              height="20px"
              width="20px"
              version="1.1"
              id="Capa_1"
              viewBox="0 0 488.4 488.4"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <g>
                  <g>
                    <path d="M0,203.25c0,112.1,91.2,203.2,203.2,203.2c51.6,0,98.8-19.4,134.7-51.2l129.5,129.5c2.4,2.4,5.5,3.6,8.7,3.6 s6.3-1.2,8.7-3.6c4.8-4.8,4.8-12.5,0-17.3l-129.6-129.5c31.8-35.9,51.2-83,51.2-134.7c0-112.1-91.2-203.2-203.2-203.2 S0,91.15,0,203.25z M381.9,203.25c0,98.5-80.2,178.7-178.7,178.7s-178.7-80.2-178.7-178.7s80.2-178.7,178.7-178.7 S381.9,104.65,381.9,203.25z"></path>{" "}
                  </g>
                </g>
              </g>
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
};

export default UserSearch;
