import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import UserDetailCont from "./component/UserDetailCont";
import UserSearch from "../../../../components/UserSearch/UserSearch";
import Loader from "../../../../components/Loader/Loader";
import _ from "lodash";

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

function useFetchUserData(activeButton, page, reset) {
  const [userData, setUserData] = useState([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeButton || !hasMoreData) return;

    const fetchUserData = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URI}/api/jym/getuserbystatus`,
          {
            params: {
              statusType: activeButton.toLowerCase().replace(/-/g, ""),
              skip: (page - 1) * LIMIT,
            },
            withCredentials: true,
          }
        );

        const fetchedData = response.data.data;

        if (reset) {
          setUserData(fetchedData);
        } else {
          setUserData((prev) => [...prev, ...fetchedData]);
        }

        // If fewer items than the limit are fetched, it means no more data.
        setHasMoreData(fetchedData.length >= LIMIT);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [activeButton, page, reset, hasMoreData]);

  useEffect(() => {
    setHasMoreData(true); // Reset when activeButton changes
  }, [activeButton]);

  return { userData, hasMoreData, loading, setUserData };
}

const Users = () => {
  const [activeButton, setActiveButton] = useState(null);
  const [page, setPage] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, hasMoreData, loading, setUserData } = useFetchUserData(
    activeButton,
    page,
    page === 1
  );
  const [filteredData, setFilteredData] = useState([]);
  const scrollContainerRef = useRef(null);

  // Handle initial navigated data
  useEffect(() => {
    if (location.state?.initialUserData) {
      const initialData = location.state.initialUserData;
      setUserData(initialData); // Set as user data
      setFilteredData(initialData); // Filter and set data
      navigate(location.pathname, { replace: true }); // Clear state
    }
  }, [location.state, navigate, setUserData]);

  useEffect(() => {
    const uniqueArray = Array.from(
      new Map(userData.map((item) => [item.userId, item])).values()
    );
    setFilteredData(uniqueArray);
  }, [userData]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      if (
        scrollHeight - scrollTop <= clientHeight + 10 &&
        !loading &&
        hasMoreData
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    const debouncedHandleScroll = _.debounce(handleScroll, 100);
    scrollContainer.addEventListener("scroll", debouncedHandleScroll);
    return () =>
      scrollContainer.removeEventListener("scroll", debouncedHandleScroll);
  }, [hasMoreData, loading]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusType = params.get("statusType");

    const matchedButton = buttons.find(
      (btn) => btn.toLowerCase().replace(/-/g, "") === statusType
    );

    if (matchedButton !== activeButton) {
      setActiveButton(matchedButton || null);
      setPage(1);
      setUserData([]); // Clear existing data
    }
  }, [location.search, activeButton, setUserData]);

  const handleButtonClick = (button) => {
    navigate(`?statusType=${button}`);
  };

  return (
    <div
      ref={scrollContainerRef}
      className="overflow-y-auto"
      style={{ height: "calc(100vh - 140px)" }}
    >
      <div className="px-5">
        <UserSearch />
      </div>
      <div className="buttons flex overflow-x-scroll w-full space-x-2 px-5">
        {buttons.map((button, index) => (
          <button
            key={`${button} ${index}`}
            onClick={() =>
              handleButtonClick(button.toLowerCase().replace(/-/g, ""))
            }
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
        {filteredData.map((obj) => (
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
