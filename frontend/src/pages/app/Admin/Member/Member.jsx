import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getQueryParams } from "../../../../utils/helperFunc";
import useFetchUser from "./useHooks/useFetchUser";
import useMembership from "./useHooks/useMembership";
import Membership from "../../User/Home/Component/Membership";
import Calendar from "./components/Calendar";
import axios from "axios";
import { addDays, format } from "date-fns";
import CustomButton from "../../../../components/Button/Button";
import { toast } from "react-toastify";
import MemberRecordBar from "./components/MemberRecordBar";
import Loader from "../../../../components/Loader/Loader";

const Member = () => {
  const location = useLocation();
  const queryParams = getQueryParams(location.search);
  const navigate = useNavigate();

  const userId = queryParams.get("userId");
  const userUniqueId = queryParams.get("userUniqueId");

  const [status, setStatus] = useState({
    "In-active": false,
    Register: false,
    "Register-Again": false,
    Renew: false,
  });
  const [currentStatus, setCurrentStatus] = useState("");
  const [formData, setFormData] = useState({
    month: 1,
    amount: "",
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 30));

  const { user, loading, error } = useFetchUser(userId, userUniqueId);
  const { membership } = useMembership(user);

  const payload = {
    startDate: membership?.endDate,
    month: formData.month,
    amount: formData.amount,
    ...(userId ? { userId } : { userUniqueId }),
  };

  const userIdObj = userId ? { userId } : { userUniqueId };

  useEffect(() => {
    if (membership?.endDate) {
      const membershipEndDate = new Date(membership.endDate);
      membershipEndDate.setHours(0, 0, 0, 0);
      setSelectedDate(membershipEndDate);
    }
  }, [membership]);

  useEffect(() => {
    const fetchMembershipStatus = async () => {
      try {
        const endpoint = `${process.env.REACT_APP_BACKEND_URI}/api/membership/memberstatus`;
        const res = await axios.get(
          userId
            ? `${endpoint}?userId=${userId}`
            : `${endpoint}?userUniqueId=${userUniqueId}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          setStatus(res.data.status);
          const activeStatus = Object.entries(res.data.status)
            .filter(([_, value]) => value === true)
            .map(([key]) => key);
          setCurrentStatus(activeStatus[0]);
        }
      } catch (err) {
        console.error("Error fetching membership status:", err);
      }
    };

    if (user) fetchMembershipStatus(); // Only fetch if user exists
  }, [user, userId, userUniqueId]);

  useEffect(() => {
    setEndDate(addDays(selectedDate, formData.month * 30));
  }, [selectedDate, formData.month]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: Number(value),
    }));
  };

  const handleSubmission = async (endpoint, successMessage) => {
    try {
      const res = await axios.post(endpoint, payload, {
        withCredentials: true,
      });
      const attendanceEndpoint =
        currentStatus === "Register-Again"
          ? "/api/attendance/registeragain"
          : "/api/attendance/register";

      if (currentStatus === "Register" || currentStatus === "Register-Again") {
        const attendanceRes = await axios.post(
          `${process.env.REACT_APP_BACKEND_URI}${attendanceEndpoint}`,
          userIdObj,
          { withCredentials: true }
        );
        if (res.data.success && attendanceRes.data.success) {
          toast.success(successMessage);
          navigate("/admin/scanner");
        }
      } else if (res.data.success) {
        toast.success(successMessage);
        navigate("/admin/scanner");
      }
    } catch (err) {
      console.error("Error in membership handling:", err);
      toast.error(
        err?.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const handleSubmit = () => {
    if (!formData?.amount) {
      toast.error("fill payment fee");
      return;
    }

    switch (currentStatus) {
      case "Renew":
      case "In-active":
        handleSubmission(
          `${process.env.REACT_APP_BACKEND_URI}/api/membership/renewmembership`,
          "Member renewed successfully"
        );
        break;
      case "Register-Again":
        handleSubmission(
          `${process.env.REACT_APP_BACKEND_URI}/api/membership/renewmembership`,
          "Member registered again"
        );
        break;
      case "Register":
        handleSubmission(
          `${process.env.REACT_APP_BACKEND_URI}/api/membership/createmembership`,
          "Membership created successfully"
        );
        break;
      default:
        toast.error("Invalid membership status.");
    }
  };

  const activateMember = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/attendance/activate`,
        { userId: user._id },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate(0); // Re-renders the component without full page reload
      }
    } catch (error) {
      console.error("Error configuring membership:", error);
      toast.error(
        error.response?.data?.message || "Error activating membership"
      );
    }
  };

  useEffect(() => {
    if (error?.message === "User not found") {
      navigate("/admin/scanner");
      toast.error("User does not exist!");
    }
  }, [error, navigate]);

  if (loading)
    return (
      <div>
        <Loader />
      </div>
    ); // Show loading state until user data is available

  return (
    <div>
      {user && <MemberRecordBar locationSearch={`?userId=${user._id || ""}`} />}
      {user && !status.Register && (
        <Calendar
          user={user}
          setSelectedDate={setSelectedDate}
          selectedDate={selectedDate}
          membershipPreviousStartDate={membership?.startDate}
        />
      )}
      <div className="wrapper mx-4">
        {user && !status.Register && (
          <Membership user={user} membership={membership} />
        )}
        {user && !membership.Inactive && (
          <form className="my-4 bg-slate-100 px-4 py-4 rounded-xl border border-stone-300">
            <div className="details">
              <h2 className="text-lightBlack text-2xl my-4 font-medium text-center">
                Membership Duration
              </h2>
              <p className="text-lightBlack text-xl my-4 font-medium text-center">
                {format(selectedDate, "dd-MMM")} to {format(endDate, "dd-MMM")}
              </p>
            </div>
            <label
              htmlFor="month"
              className="block mb-2 font-medium text-lightBlack"
            >
              Month
            </label>
            <select
              id="month"
              className="input-field"
              value={formData.month}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Month
              </option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <label
              htmlFor="amount"
              className="block mt-4 mb-2 font-medium text-lightBlack"
            >
              Payment Fee
            </label>
            <input
              type="number"
              id="amount"
              className="input-field"
              placeholder="Payment Fee"
              value={formData.amount}
              onChange={handleChange}
              required
            />
            <CustomButton fullWidth={true} type="button" onClick={handleSubmit}>
              {currentStatus} Membership
            </CustomButton>
          </form>
        )}
      </div>
      {user && membership.Inactive && (
        <div className="px-4 my-6">
          <button
            className=" bg-slate-50 p-3 w-full border border-solid text-xl font-medium text-lightBlack text-center border-slate-300 rounded-lg"
            onClick={activateMember}
          >
            Activate Member
          </button>
        </div>
      )}
    </div>
  );
};

export default Member;
