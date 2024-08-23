import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./home.css";
import clock from "../../../images/tabler_clock.svg";
import circleTick from "../../../images/charm_circle-tick.svg";
import crossCircle from "../../../images/cross_circle.svg";
import workoutPlanImg from "../../../images/workoutPlan.webp";
import CustomButton from "../../../components/Button/Button";
import { getObjectFromLocalStorage } from "../../../utils/helperFunc";
import WorkoutPlan from "../../../components/workoutPlan/WorkoutPlan";

const getSundaysCountInMonth = (startDate, endDate) => {
  if (!new Date(startDate).getTime() > new Date(endDate).getTime) {
    let sundays = 0;
    let currDateTime = new Date(startDate).getTime();
    let endDateTime = new Date(endDate).getTime();
    let timeDiff = endDateTime - currDateTime;
    let diffDays = Math.abs(timeDiff / (24 * 60 * 60 * 1000));

    for (let i = 1; i <= diffDays; i++) {
      if (new Date(currDateTime).getDay() === 0) {
        sundays++;
      }
      currDateTime += 24 * 60 * 60 * 1000;
    }

    return sundays;
  }

  return 0;
};

const attendanceOfThisWeek = (attendanceArr) => {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Start of the week (Sunday)
  const endOfWeek = new Date(now.setDate(now.getDate() + 6)); // End of the week (Saturday)

  // Initialize the week's status array with 'pending'
  const weekStatus = [
    { day: "Sun", status: "pending" },
    { day: "Mon", status: "pending" },
    { day: "Tue", status: "pending" },
    { day: "Wed", status: "pending" },
    { day: "Thu", status: "pending" },
    { day: "Fri", status: "pending" },
    { day: "Sat", status: "pending" },
  ];

  // Filter the attendance for the current week
  const weekAttendance = attendanceArr.filter((attendance) => {
    const checkInDate = new Date(attendance.checkIn);

    return checkInDate >= startOfWeek && checkInDate <= endOfWeek;
  });

  // Track the last attended day
  let lastAttendedDay = -1;

  // Map attendance to the corresponding day
  weekAttendance.forEach((attendance) => {
    const checkInDate = new Date(attendance.checkIn);
    const dayOfWeek = checkInDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

    weekStatus[dayOfWeek].status = "present";
    lastAttendedDay = dayOfWeek;
  });

  // Mark absent days up to the last attended day
  weekStatus.forEach((day, index) => {
    if (index < lastAttendedDay && day.status === "pending") {
      day.status = "absent";
    }
  });

  return weekStatus;
};

const attendedDaysInPercentage = (sd, ed, arr) => {
  let sundays = getSundaysCountInMonth(sd, ed);
  let totalDays = arr.length + sundays;
  let calc = Math.floor(totalDays / 30);
  let attendedDaysInPercentage = Math.floor(calc * 100);
  return attendedDaysInPercentage;
};

const Home = () => {
  const [user, setUser] = useState("");
  const [workout, setWorkout] = useState([]);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [attendanceArr, setAttendanceArr] = useState([
    { day: "Sun", status: "pending" },
    { day: "Mon", status: "pending" },
    { day: "Tue", status: "pending" },
    { day: "Wed", status: "pending" },
    { day: "Thu", status: "pending" },
    { day: "Fri", status: "pending" },
    { day: "Sat", status: "pending" },
  ]);
  const [membership, setMembership] = useState({
    expired: false,
    days: "--",
    date: "-",
    month: "-",
    year: "-",
  });

  // Ref to cache data
  const membershipCache = useRef(null);
  const attendanceCache = useRef(null);
  const workoutCache = useRef(null);

  const capitalizeFLetter = (text) => {
    return text[0].toUpperCase() + text.slice(1);
  };

  let userName = user?.username ? capitalizeFLetter(user.username) : "";

  // useeffect function

  const sortWorkoutPlans = (workoutPlans) => {
    const dayOfWeekOrder = {
      sun: 0,
      mon: 1,
      tue: 2,
      wed: 3,
      thu: 4,
      fri: 5,
      sat: 6,
    };

    return workoutPlans.sort((a, b) => {
      return dayOfWeekOrder[a.dayOfWeek] - dayOfWeekOrder[b.dayOfWeek];
    });
  };

  const calculateDaysUntilExpiration = (membershipEndDate) => {
    const membershipEndDateTime = new Date(membershipEndDate).getTime();
    const now = new Date().getTime();
    const diff = membershipEndDateTime - now;
    return Math.round(diff / (1000 * 60 * 60 * 24));
  };

  // Function to fetch membership data
  const fetchMembershipData = async (currentJymId) => {
    if (membershipCache.current) {
      return membershipCache.current;
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URI}/api/membership/getmembership/${currentJymId}`,
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

  // Function to fetch attendance data
  const fetchAttendanceData = async (currentJymId, startDate, endDate) => {
    if (attendanceCache.current) {
      return attendanceCache.current;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/attendance/getattendancebydate`,
        {
          jymId: currentJymId,
          startDate: startDate,
          endDate: endDate,
        },
        {
          withCredentials: true,
        }
      );
      attendanceCache.current = response.data;
      return response.data;
    } catch (err) {
      console.error("Error fetching attendance data: ", err);
      return null;
    }
  };

  // Function to fetch workout plans
  const fetchWorkoutPlans = async () => {
    if (workoutCache.current) {
      return workoutCache.current;
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URI}/api/workout/getallworkout`,
        {
          withCredentials: true,
        }
      );

      const sortedWorkoutPlans = sortWorkoutPlans(response.data.workoutPlans);
      workoutCache.current = sortedWorkoutPlans;

      return { success: true, workoutPlans: sortedWorkoutPlans };
    } catch (err) {
      console.error("Error fetching workout plans: ", err);
      return null;
    }
  };

  const handleMembershipData = async (data, currentJymId) => {
    if (!data || !data.success) return;

    const membershipEndDate = new Date(data.membership.endDate);
    const daysUntilExpiration = calculateDaysUntilExpiration(membershipEndDate);

    if (daysUntilExpiration < 0) {
      setMembership({
        expired: true,
        days: Math.abs(daysUntilExpiration),
        date: membershipEndDate.getDate(),
        month: membershipEndDate.getMonth() + 1,
        year: membershipEndDate.getFullYear(),
      });

      if (new Date().getTime() < membershipEndDate.getTime()) {
        const attendanceData = await fetchAttendanceData(
          currentJymId,
          data.membership.startDate,
          data.membership.endDate
        );

        if (
          attendanceData &&
          attendanceData.success &&
          attendanceData.attendance.length > 0
        ) {
          const totalAttendancePercentage = attendedDaysInPercentage(
            data.membership.startDate,
            data.membership.endDate,
            attendanceData.attendance
          );
          setAttendancePercentage(totalAttendancePercentage);

          const weekAttendanceStatus = attendanceOfThisWeek(
            attendanceData.attendance
          );
          setAttendanceArr(weekAttendanceStatus);
        }
      }
    } else {
      setMembership({ expired: false, days: daysUntilExpiration });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const currentJym = getObjectFromLocalStorage("currentJym");

      if (currentJym?.id) {
        const membershipData = await fetchMembershipData(currentJym.id);
        await handleMembershipData(membershipData, currentJym.id);
      }

      const workoutPlans = await fetchWorkoutPlans();
      if (workoutPlans && workoutPlans.success) {
        setWorkout(workoutPlans.workoutPlans);
      }

      setUser(getObjectFromLocalStorage("user"));
    };

    loadData();
  }, []);

  const getWeekDates = () => {
    const weekDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
    const weekDates = {};

    weekDays.forEach((day, index) => {
      const diff = index - dayOfWeek;
      const date = new Date(today);
      date.setDate(today.getDate() + diff);
      weekDates[day] = date;
    });

    return weekDates;
  };

  const weekDates = getWeekDates();

  const Days = ({ arr }) => {
    return arr.map((data, index) => (
      <div
        key={index}
        className={`day min-w-[70px] min-h-[80px] flex gap-1 rounded-xl border ${
          data.status === "present"
            ? "bg-greenBox border-gray-300"
            : data.status === "absent"
            ? "bg-redBox text-white"
            : "border-slate-600 border-2 "
        } flex-col place-content-center place-items-center`}
      >
        <p className="text">{data.day}</p>
        <img
          src={
            data.status === "present"
              ? circleTick
              : data.status === "absent"
              ? crossCircle
              : clock
          }
          alt="icon"
          className="w-5"
        />
      </div>
    ));
  };

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
        <div
          className={`box ${
            membership.expired ? "bg-redBox" : "bg-yellowBox"
          }  flex border border-slate-400 rounded-2xl justify-between px-4 py-2 max-w-screen-custom-md500  min-h-24 place-content-center  `}
        >
          <div className="imgAndExpiryDetails flex place-items-center">
            <div className="img p-2">
              <img
                src={
                  user?.img ||
                  "https://jymo.s3.ap-south-1.amazonaws.com/userProfileImg/05b8aecb079968b9386383d30cfea4446f76b1781722583225465"
                }
                alt="user"
                referrerPolicy="no-referrer"
                className="rounded-md w-10 border-2 border-white"
              />
            </div>
            <div
              className={`text font-medium  text-lg ${
                membership.expired ? "text-white" : "text-lightBlack"
              }`}
            >
              <p>
                {membership.expired ? "Expired" : "ExpiresIn"} :{" "}
                <span>{membership.days} days</span>
              </p>
            </div>
          </div>
          <div
            className={`date  self-end text-xs font-medium   ${
              membership.expired ? "text-white" : "text-lightBlack"
            }`}
          >
            <p>
              <span className="text-[16px]">{membership.date}</span>-
              {membership.month}-{membership.year}
            </p>
          </div>
        </div>
        <div className="attendanceBox border border-slate-400 bg-yellowBox flex rounded-2xl  p-2 max-w-screen-custom-md500  min-h-24 place-content-center place-items-center relative ">
          <div className="attendance flex flex-col place-items-center">
            <p className="text-2xl text-lightBlack pb-1">
              {attendancePercentage}%
            </p>
            <p className="text-sm text-lightBlack ">Attendance Of This Month</p>
          </div>
        </div>
      </div>
      <div className="workoutDays">
        <h2 className="text-lightBlack text-xl font-medium pt-8 pb-2">
          Workout Days
        </h2>
        <div
          className="workoutAttendanceDays flex gap-3"
          style={{ width: "calc(100% + 40px)" }}
        >
          <Days arr={attendanceArr} />
        </div>
      </div>
      <div className="plan">
        <div className="planContainer text-lightBlack text-xl font-medium pt-6 pb-2">
          <h2>Your Workout Plans !</h2>
          <div className="planBox flex flex-col   place-items-center ">
            {workout.length ? (
              <div className="flex flex-col py-5 gap-y-6 w-full">
                {workout?.length &&
                  workout.map((data) => {
                    const date = weekDates[data.dayOfWeek]?.toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                      }
                    );
                    return (
                      <WorkoutPlan key={data._id} data={data} date={date} />
                    );
                  })}
              </div>
            ) : (
              <div className="planBox2 flex flex-col  py-2  place-items-center ">
                <img
                  src={workoutPlanImg}
                  alt="workout plan"
                  className="pt-7 pb-2"
                  style={{ maxWidth: "250px" }}
                />
                <CustomButton fullWidth={true}>Let's Create Plan</CustomButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
