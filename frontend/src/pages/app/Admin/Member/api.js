import axios from "axios";

export const fetchMembershipDataByAdmin = async (userId, membershipCache) => {
  if (membershipCache.current) {
    return membershipCache.current;
  }
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URI}/api/membership/getmembershipbyuserid/${userId}`,
      {
        withCredentials: true,
      }
    );
    membershipCache.current = response.data;
    return response.data;
  } catch (err) {
    console.error("Error fetching membership data: ", err);
    return null;
  }
};
