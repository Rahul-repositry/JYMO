// hooks/useFetchUser.js
import { useEffect, useState } from "react";
import axios from "axios";

const useFetchUser = (userId, userUniqueId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        let endpoint;

        if (userId) {
          endpoint = `${process.env.REACT_APP_BACKEND_URI}/api/user/userId/${userId}`;
        } else if (userUniqueId) {
          endpoint = `${process.env.REACT_APP_BACKEND_URI}/api/user/userUniqueId/${userUniqueId}`;
        } else {
          setLoading(false);
          return;
        }
        const response = await axios.get(endpoint, {
          withCredentials: true,
        });

        if (response.data.success) {
          setUser(response.data.user);
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        setError(err.response.data);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, userUniqueId]);

  return { user, loading, error };
};

export default useFetchUser;
