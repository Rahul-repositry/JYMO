import axios from "axios";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Loader from "../../../../components/Loader/Loader";
import MembershipCon from "../../../../components/MembershipCon/MembershipCon";
import { useLocation } from "react-router-dom";
import { getQueryParams } from "../../../../utils/helperFunc";

const FeeRecord = () => {
  const [skip, setSkip] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const location = useLocation();
  const queryParams = getQueryParams(location.search);
  console.log(location.search);
  const userId = queryParams.get("userId");
  const dataCache = useRef(new Map()); // Cache to store membership data

  const fetchDetails = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/membership/getallmembership/admin?skip=${skip}`,
        { userId: userId },
        { withCredentials: true }
      );
      const responseData = response.data;

      if (responseData.success) {
        const newMemberships = responseData.memberships.filter(
          (membership) => !dataCache.current.has(membership._id)
        );

        // Update cache with new memberships
        newMemberships.forEach((membership) => {
          dataCache.current.set(membership._id, membership);
        });

        setData((prevData) => [...prevData, ...newMemberships]);
        setSkip((prevSkip) => prevSkip + 20);

        if (newMemberships.length < 20) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching membership data:", error);
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
        data.map((membership) => (
          <MembershipCon key={membership._id} membership={membership} />
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

export default FeeRecord;
