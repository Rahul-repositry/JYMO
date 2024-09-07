import React, { useEffect, useRef, useState } from "react";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isSunday,
  isToday,
  parse,
  parseISO,
  startOfDay,
  startOfToday,
} from "date-fns";
import axios from "axios";
import WorkoutPlan from "../../../components/workoutPlan/WorkoutPlan";
import { Link } from "react-router-dom";

function classNames(...classes) {
  console.log(classes);
  return classes.filter(Boolean).join(" ");
}

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

const Calendar = () => {
  // not currently showing status of absent because it becomes difficult at time when t
  const today = startOfToday();
  //   const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const attendanceMonthCache = useRef({});
  const daysWithStatusCache = useRef({});
  const workoutCache = useRef({});
  const [workout, setWorkout] = useState([
    { dayOfWeek: "sun", _id: "id1-sun" },
    { dayOfWeek: "mon", _id: "id2-mon" },
    { dayOfWeek: "tue", _id: "id3-tue" },
    { dayOfWeek: "wed", _id: "id4-wed" },
    { dayOfWeek: "thu", _id: "id5-thu" },
    { dayOfWeek: "fri", _id: "id6-fri" },
    { dayOfWeek: "sat", _id: "id7-sat" },
  ]);

  console.log(daysWithStatusCache);
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  const initializeDaysWithStatus = () => {
    return days.map((date) => ({
      date,
      status: "pending",
    }));
  };
  const getWeekDates = () => {
    const weekDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
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
  console.log(weekDates);

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

  const fetchWorkoutPlans = async () => {
    if (workoutCache.current.length > 0) {
      return workoutCache.current;
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URI}/api/workout/getallworkout`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      const sortedWorkoutPlans = sortWorkoutPlans(response.data.workoutPlans);
      workoutCache.current = sortedWorkoutPlans;
      console.log({ sortedWorkoutPlans });
      return { success: true, workoutPlans: sortedWorkoutPlans };
    } catch (err) {
      console.error("Error fetching workout plans: ", err);
      return null;
    }
  };

  const [daysWithStatus, setDaysWithStatus] = useState(
    initializeDaysWithStatus()
  );

  const fetchAttendanceMonthData = async (currentJymId, startDate, endDate) => {
    const today = new Date();

    // Check if the start date is in the future

    if (new Date(startDate) > today) {
      return {
        success: true,
        attendance: [], // Return an empty attendance array
      };
    }

    // Check cache
    if (attendanceMonthCache.current[currentMonth]) {
      return attendanceMonthCache.current[currentMonth];
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/attendance/getattendancebydate`,
        {
          jymId: currentJymId,
          startDate,
          endDate,
        },
        {
          withCredentials: true,
        }
      );
      attendanceMonthCache.current[currentMonth] = response.data;
      console.log({ attendanceMonthCache, data: response });
      return response.data;
    } catch (err) {
      console.error("Error fetching attendance data: ", err);
      return {
        success: false,
        attendance: [],
      };
    }
  };

  const updateDaysWithAttendance = (attendanceData) => {
    attendanceData.forEach((att) => {
      console.log(new Date(att?.checkIn));
    });
    if (attendanceData?.length > 0) {
      if (daysWithStatusCache.current[currentMonth]) {
        console.log("cached executed");
        setDaysWithStatus(daysWithStatusCache.current[currentMonth]);
        return;
      }

      const updatedDays = initializeDaysWithStatus().map((dayObj) => {
        const dayDate = startOfDay(dayObj.date).getTime().toString();
        const attendanceRecord = attendanceData?.find((att) => {
          let chqDate = startOfDay(parseISO(att?.checkIn)).getTime().toString();
          return chqDate === dayDate;
        });

        if (attendanceRecord) {
          return { ...dayObj, status: "present" };
        } else if (getDay(dayObj.date) === 0) {
          return { ...dayObj, status: "holiday" };
        } else {
          return { ...dayObj, status: "pending" };
        }
      });

      daysWithStatusCache.current[currentMonth] = updatedDays;
      setDaysWithStatus(updatedDays);
    } else {
      const updatedDays = initializeDaysWithStatus();
      setDaysWithStatus(updatedDays);
    }
  };

  const loadCalendarData = async () => {
    const startDate = firstDayCurrentMonth.toISOString();
    const endDate = endOfMonth(firstDayCurrentMonth).toISOString();

    const attendanceData = await fetchAttendanceMonthData(
      "66b494c994292de725fe1a0e", // replace it with redux context jymid
      startDate,
      endDate
    );

    if (attendanceData?.success) {
      updateDaysWithAttendance(attendanceData.attendance);
    } else {
      console.log("Error fetching attendance data");
      updateDaysWithAttendance([]);
    }
  };

  useEffect(() => {
    loadCalendarData();
  }, [currentMonth]);

  useEffect(() => {
    const loadWorkoutData = async () => {
      try {
        const workoutPlans = await fetchWorkoutPlans();

        if (workoutPlans && workoutPlans.success) {
          setWorkout(workoutPlans.workoutPlans);
        }
      } catch (err) {
        console.log("no workout found");
      }
    };

    loadWorkoutData();
  }, []);

  console.log(workout);

  const previousMonth = () => {
    const firstDayPreviousMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPreviousMonth, "MMM-yyyy"));
  };

  const nextMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  };

  return (
    <>
      <div className="bg-slate-100 my-6 py-5 border border-gray-300">
        <div className="px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
          <div className="">
            <div className="flex items-center">
              <button
                type="button"
                onClick={previousMonth}
                className="-my-1.5 flex flex-none items-center justify-center border-gray-200 p-1.5 text-gray-400 rounded-xl hover:text-gray-500"
                style={{ border: "1px solid " }}
              >
                <svg
                  className="h-7 w-7"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <h2 className="flex-auto font-semibold text-gray-900 text-center">
                {format(firstDayCurrentMonth, "MMMM yyyy")}
              </h2>
              <button
                onClick={nextMonth}
                type="button"
                className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center rounded-xl border-gray-200 justify-center p-1.5 text-gray-400 hover:text-gray-500"
                style={{ border: "1px solid " }}
              >
                <span className="sr-only">Next month</span>
                <svg
                  className="h-7 w-7"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
              <div>S</div>
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
            </div>
            <div className="grid grid-cols-7 mt-2 text-sm">
              {daysWithStatus.map((dayObj, dayIdx) => {
                if (isToday(dayObj.date)) {
                  console.log({ dayObj }, "heree");
                }
                return (
                  <div
                    key={dayObj.date.toString()}
                    className={classNames(
                      dayIdx === 0 && colStartClasses[getDay(dayObj.date)],
                      "py-1.5"
                    )}
                  >
                    <button
                      type="button"
                      className={classNames(
                        isSameMonth(dayObj.date, firstDayCurrentMonth) &&
                          dayObj.status === "present" &&
                          "bg-green-500 text-white",
                        isToday(dayObj.date) && "bg-yellowBox text-white",
                        isToday(dayObj.date) &&
                          dayObj.status === "present" &&
                          "!bg-green-500 text-white",
                        isSunday(dayObj.date) && "text-redBox ",

                        "font-semibold",
                        "mx-auto flex h-8 w-8 items-center justify-center rounded-lg"
                      )}
                    >
                      <time dateTime={format(dayObj.date, "yyyy-MM-dd")}>
                        {format(dayObj.date, "d")}
                      </time>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="plan p-5">
        <div className="planContainer text-lightBlack text-xl font-medium pt-6 pb-2">
          <div className="heading flex justify-between place-items-center">
            <h2>Your Workout Plans !</h2>
            <Link to="/editworkout">
              <span className=" text-sm underline text-red-500">
                Edit Plans
              </span>
            </Link>
          </div>
          <div className="planBox flex flex-col   place-items-center ">
            {workout.length && (
              <div className="flex flex-col py-5 gap-y-6 w-full">
                {workout.map((data) => {
                  const date = weekDates[data.dayOfWeek]?.toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                    }
                  );
                  console.log(date);
                  return <WorkoutPlan key={data._id} data={data} date={date} />;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;
