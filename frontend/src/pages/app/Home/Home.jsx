import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Attendance from "./Component/Attendance.jsx";
import Membership from "./Component/Membership.jsx";
import WorkoutPlans from "./Component/WorkoutPlans.jsx";
import {
  capitalizeFLetter,
  getObjectFromLocalStorage,
} from "../../../utils/helperFunc.js";
import "./home.css";
import {
  fetchAttendanceData,
  fetchMembershipData,
  fetchWorkoutPlans,
} from "./utils/api.js";
import {
  attendanceOfThisWeek,
  attendedDaysInPercentage,
  calculateDiffOfEndDateAndToday,
  filterUniqueCheckIns,
} from "./utils/utils.js";
import { endOfMonth, startOfMonth } from "date-fns";

const Home = () => {
  const [user, setUser] = useState("");
  const [workout, setWorkout] = useState([]);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [attendanceArr, setAttendanceArr] = useState([
    {
      day: "Sun",
      status: "pending",
    },
    {
      day: "Mon",
      status: "pending",
    },
    {
      day: "Tue",
      status: "pending",
    },
    {
      day: "Wed",
      status: "pending",
    },
    {
      day: "Thu",
      status: "pending",
    },
    {
      day: "Fri",
      status: "pending",
    },
    {
      day: "Sat",
      status: "pending",
    },
  ]);
  const [membership, setMembership] = useState({
    expired: false,
    days: "--",
    date: "-",
    month: "-",
    year: "-",
    endDate: undefined,
  });

  const membershipCache = useRef(null);
  const attendanceCache = useRef(null);
  const workoutCache = useRef(null);

  const userName = user?.username ? capitalizeFLetter(user.username) : "";

  const handleMembershipData = (data) => {
    if (!data || !data.success) return;

    const membershipEndDate = new Date(data.membership.endDate);
    const diffOfEndDateAndToday =
      calculateDiffOfEndDateAndToday(membershipEndDate);

    if (diffOfEndDateAndToday < 0) {
      setMembership({
        expired: true,
        days: Math.abs(diffOfEndDateAndToday),
        date: membershipEndDate.getDate(),
        month: membershipEndDate.getMonth() + 1,
        year: membershipEndDate.getFullYear(),
        endDate: membershipEndDate,
      });
    } else {
      setMembership((prev) => ({
        ...prev,
        expired: false,
        days: diffOfEndDateAndToday,
        endDate: membershipEndDate,
      }));
    }
  };

  const handleAttendanceData = (data) => {
    if (data && data.success && data.attendance.length > 0) {
      let currentDate = new Date();
      // Filter attendance to remove duplicates based on the same check-in date
      const uniqueAttendanceData = filterUniqueCheckIns(data.attendance);

      const totalAttendancePercentage = attendedDaysInPercentage(
        startOfMonth(currentDate),
        endOfMonth(currentDate),
        uniqueAttendanceData
      );

      setAttendancePercentage(totalAttendancePercentage);

      const weekAttendanceStatus = attendanceOfThisWeek(uniqueAttendanceData);

      setAttendanceArr(weekAttendanceStatus);
    }

    return;
  };

  useEffect(() => {
    const loadData = async () => {
      const currentJym = getObjectFromLocalStorage("currentJym");

      let currentDate = new Date();

      if (currentJym?.jymId) {
        const membershipData = await fetchMembershipData(
          currentJym.jymId,
          membershipCache
        );
        const attendnaceData = await fetchAttendanceData(
          currentJym.jymId,
          startOfMonth(currentDate),
          endOfMonth(currentDate),
          attendanceCache
        );

        handleAttendanceData(attendnaceData, attendanceCache);

        handleMembershipData(membershipData, currentJym.jymId);
      }

      const workoutPlans = await fetchWorkoutPlans(workoutCache);
      if (workoutPlans && workoutPlans.success) {
        setWorkout(workoutPlans.workoutPlans);
      }

      setUser(getObjectFromLocalStorage("user"));
    };

    loadData();
  }, []);

  return (
    <div className="wrapperHome p-5">
      <div className="wrapperWelcome ">
        <div className="welcomeBox pt-4 pb-3 pr-4  ">
          <h2 className="text-customButton py-1 text-xl font-medium pr-2">
            <span className="helloo mr-1">🙏</span>
            Welcome, {userName} !!
          </h2>
          {!workout?.length && (
            <div className="text font-semibold mr-2 text-gray-500">
              <span className="helloo text-xl mr-1">💪</span>
              Plan bna lo yaar !!
            </div>
          )}
        </div>
      </div>
      <div className="homeContainer pt-3 flex flex-col gap-5">
        <Membership membership={membership} user={user} />
        <Attendance
          attendancePercentage={attendancePercentage}
          attendanceArr={attendanceArr}
        />
      </div>
      <WorkoutPlans workout={workout} />
    </div>
  );
};

export default Home;
