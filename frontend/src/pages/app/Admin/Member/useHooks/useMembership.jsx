// hooks/useMembership.js
import { useState, useEffect, useRef } from "react";

import { calculateDiffOfEndDateAndToday } from "../../../User/Home/utils/utils.js";
import { fetchMembershipDataByAdmin } from "../api.js";

const useMembership = (user) => {
  const [membership, setMembership] = useState({
    expired: false,
    days: "--",
    startDate: null,
    endDate: null,
    Inactive: false,
    lastChqInDate: "",
  });
  const membershipCache = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user?._id) {
        // Now using the passed-in user prop
        const membershipData = await fetchMembershipDataByAdmin(
          user._id,
          membershipCache
        );

        if (membershipData && membershipData.success) {
          const membershipEndDate = new Date(membershipData.membership.endDate);
          const daysRemaining =
            calculateDiffOfEndDateAndToday(membershipEndDate);

          setMembership({
            expired: daysRemaining < 0,
            days: Math.abs(daysRemaining),
            startDate: membershipData.membership.startDate,
            endDate: membershipEndDate,
            Inactive: !membershipData.membership.status.active.value,
            lastChqInDate: membershipData.membership.status.active.lastCheckIn,
          });
        }
      }
    };

    fetchData();
  }, [user]);

  return { membership };
};

export default useMembership;
