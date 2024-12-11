import axios from "axios";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Loader from "../../../../components/Loader/Loader";
import MembershipCon from "../../../../components/MembershipCon/MembershipCon";
import { getObjectFromLocalStorage } from "../../../../utils/helperFunc";
import _ from "lodash";

const LIMIT = 20; // Items per request

const PastRecords = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const currentJym = getObjectFromLocalStorage("currentJym");
  const scrollContainerRef = useRef(null);
  const nextPage = useRef(0); // Tracks the next page to fetch
  const processedIds = useRef(new Set()); // Tracks unique IDs to avoid duplicates

  const fetchDetails = useCallback(async () => {
    if (loading || !hasMore) return; // Prevent overlapping calls

    setLoading(true);
    try {
      const skip = nextPage.current * LIMIT; // Calculate skip based on nextPage

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/membership/getallmembership`,
        { jymId: currentJym.jymId, skip, limit: LIMIT },
        { withCredentials: true }
      );

      const responseData = response.data;
      if (responseData.success) {
        const newMemberships = responseData.memberships;

        // Filter out already processed IDs
        const uniqueMemberships = newMemberships.filter(
          (item) => !processedIds.current.has(item._id)
        );

        // Update processed IDs and data
        uniqueMemberships.forEach((item) => processedIds.current.add(item._id));
        setData((prevData) => [...prevData, ...uniqueMemberships]);

        // Increment page only if new data is added
        if (uniqueMemberships.length > 0) {
          nextPage.current += 1;
        }

        // If fewer items than LIMIT are fetched, it means no more data
        if (newMemberships.length <= LIMIT) {
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
  }, [hasMore, loading]);

  useEffect(() => {
    fetchDetails(); // Initial fetch
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;

      if (
        scrollHeight - scrollTop <= clientHeight + 10 && // Trigger near bottom
        !loading &&
        hasMore
      ) {
        fetchDetails();
      }
    };

    // Debounce scroll events to avoid redundant calls
    const debouncedHandleScroll = _.debounce(handleScroll, 100);
    const scrollContainer = scrollContainerRef.current;

    scrollContainer.addEventListener("scroll", debouncedHandleScroll);
    return () =>
      scrollContainer.removeEventListener("scroll", debouncedHandleScroll);
  }, [fetchDetails, hasMore, loading]);

  return (
    <div
      ref={scrollContainerRef}
      className="overflow-y-auto"
      style={{ height: "calc(100vh - 140px)" }}
    >
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
    </div>
  );
};

export default PastRecords;
