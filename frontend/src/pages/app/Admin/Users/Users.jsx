import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import UserDetailCont from "./component/UserDetailCont";
import UserSearch from "../../../../components/UserSearch/UserSearch";
import Loader from "../../../../components/Loader/Loader";

const buttons = [
  "Active",
  "Inactive",
  "Newly-registered",
  "Expiring-soon",
  "Paid",
  "Unpaid",
  "Male",
  "Female",
  "Others",
];

const LIMIT = 20; // Number of items per request

const Users = () => {
  const [activeButton, setActiveButton] = useState(null);
  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchUserData = async (statusType, page = 1, reset = false) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URI}/api/jym/getuserbystatus`,
        {
          params: { statusType, skip: (page - 1) * LIMIT },
          withCredentials: true,
        }
      );

      if (reset) {
        setUserData(response.data.data);
      } else {
        setUserData((prevData) => [...prevData, ...response.data.data]);
      }

      if (response.data.data.length < LIMIT) {
        setHasMoreData(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data based on button click, initial data, or URL params
  useEffect(() => {
    console.log(location.state);

    const params = new URLSearchParams(location.search);
    const statusType = params.get("statusType");

    // 1. Check if there is an active button filter

    if (!statusType && location.state?.initialUserData) {
      console.log("working 2nd");
      setUserData([location.state.initialUserData]);
      return;
    }

    if (activeButton) {
      console.log("working 1st");

      fetchUserData(activeButton.toLowerCase().replace(/-/g, ""), page, true);
      return;
    }

    // 2. Check for initial data from location state

    // 3. Check for URL params as a fallback
    if (statusType) {
      console.log({ statusType });

      const formattedStatus =
        statusType.charAt(0).toUpperCase() +
        statusType
          .slice(1)
          .replace(/([a-z])([A-Z])/g, "$1-$2")
          .toLowerCase();

      setActiveButton(formattedStatus);
      setPage(1); // Reset page
      setHasMoreData(true);
      fetchUserData(statusType, 1, true);
    }
  }, [activeButton, location.state, location.search]);

  const handleButtonClick = (button) => {
    const formattedStatus = button.toLowerCase().replace(/-/g, "");
    setActiveButton(button);
    navigate(`?statusType=${formattedStatus}`);
  };

  const handleScroll = (e) => {
    if (
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight &&
      hasMoreData
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (activeButton && page > 1) {
      fetchUserData(activeButton.toLowerCase().replace(/-/g, ""), page);
    }
  }, [page]);
  console.log({ userData: userData });
  return (
    <div onScroll={handleScroll} className="overflow-y-auto h-screen">
      <div className="px-5">
        <UserSearch />
      </div>

      <div className="buttons flex overflow-x-scroll w-full space-x-2 px-5">
        {buttons.map((button) => (
          <button
            key={button}
            onClick={() => handleButtonClick(button)}
            className={`rounded-lg px-2 whitespace-nowrap py-1 font-md ${
              activeButton === button
                ? "bg-customButton text-white"
                : "bg-gray-200 text-black"
            } border border-slate-500`}
            disabled={loading}
          >
            {button}
          </button>
        ))}
      </div>
      <div className="px-5 my-5 flex flex-col gap-2">
        {loading && <Loader />}
        {userData.map((obj) => (
          <UserDetailCont key={obj._id} user={obj} />
        ))}
        {!hasMoreData && !loading && (
          <div className="text-center text-gray-500">No more users to load</div>
        )}
      </div>
    </div>
  );
};

export default Users;
