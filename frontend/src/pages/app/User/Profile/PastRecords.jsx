import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { capitalizeFLetter, formatTime } from "../../../../utils/helperFunc";
import { format } from "date-fns";
import Loader from "../../../../components/Loader/Loader";

const MembershipCon = ({ membership }) => {
  const { createdAt, endDate, jymId, status } = membership;
  const { name, addressLocation, phoneNumbers } = jymId;

  return (
    <div className="jymCont text-lightBlack bg-stone-100 p-4 flex flex-col gap-3 mx-5 rounded-xl my-4 border border-stone-400">
      <div className="dateTime flex justify-between text-sm">
        <p className="date">{format(new Date(createdAt), "dd-MMM-yyyy")}</p>
        <p className="time">{formatTime(new Date(createdAt))}</p>
      </div>
      <div className="details">
        <div className="jymName text-lg font-medium">
          <h2>{name} gym</h2>
        </div>
        <div className="jymAddress text-sm text-stone-500 pt-1">
          <p>
            {addressLocation.state} - {addressLocation.city} -{" "}
            {addressLocation.address}
          </p>
        </div>
      </div>

      <div className="phoneNumber flex flex-col">
        <div className="status text-xl font-medium">
          {capitalizeFLetter(status)}
        </div>
        <div className="phone text-sm pt-1">
          <p> Contacts - {phoneNumbers.join(" | ")} </p>
        </div>
      </div>
      <div className="endDate flex justify-between font-medium tracking-normal">
        <p>Ends At : {format(new Date(endDate), "dd-MMM-yyyy")}</p>
        <p className="font-bold text-xl pr-2">&#8377;{membership.amount}</p>
      </div>
    </div>
  );
};

const PastRecords = () => {
  const [skip, setSkip] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchDetails = useCallback(async () => {
    if (loading || !hasMore) return; // Prevent multiple fetches

    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URI}/api/membership/getallmembership?skip=${skip}`,
        { withCredentials: true }
      );
      const responseData = await response.data;
      console.log(responseData);
      if (responseData.success) {
        setData((prevData) => [...prevData, ...responseData.memberships]);
        setSkip((prevSkip) => prevSkip + 20);
        if (responseData.memberships.length < 20) {
          setHasMore(false); // No more data if less than 20 memberships
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching membership data:", err);
    } finally {
      setLoading(false);
    }
  }, [skip, loading, hasMore]);

  useEffect(() => {
    fetchDetails(); // Initial fetch
  }, []);

  const handleScroll = useCallback(() => {
    const bottom =
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 10;

    if (bottom && hasMore) {
      fetchDetails();
    }
  }, [fetchDetails, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      {data.length ? (
        data.map((membership, index) => (
          <MembershipCon key={index} membership={membership} />
        ))
      ) : (
        <div className="text-center font-medium text-lightBlack">
          Get registered to a gym
        </div>
      )}

      {loading && <Loader />}
      {!hasMore && (
        <p className="text-center font-medium text-lightBlack">
          -------- Memberships Ends here --------
        </p>
      )}
    </>
  );
};

export default PastRecords;
