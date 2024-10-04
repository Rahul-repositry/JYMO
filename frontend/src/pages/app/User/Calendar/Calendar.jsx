import React, { useState } from "react";
import {
  add,
  format,
  getDay,
  isSameMonth,
  isToday,
  startOfToday,
  parse,
} from "date-fns";
import { Link } from "react-router-dom";
import useWorkoutPlans from "./CustomHooks/useWorkoutPlan.js";
import useAttendance from "./CustomHooks/useAttendance.js";
import WorkoutPlan from "../../../../components/workoutPlan/WorkoutPlan.jsx";

function classNames(...classes) {
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
  const today = startOfToday();
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  const daysWithStatus = useAttendance(currentMonth, firstDayCurrentMonth);
  const workout = useWorkoutPlans();

  const getWeekDates = () => {
    const weekDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const today = new Date();
    const dayOfWeek = today.getDay();
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
              {daysWithStatus.map((dayObj, dayIdx) => (
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
                      getDay(dayObj.date) === 0 && "text-redBox",
                      "font-semibold",
                      "mx-auto flex h-8 w-8 items-center justify-center rounded-lg"
                    )}
                  >
                    <time dateTime={format(dayObj.date, "yyyy-MM-dd")}>
                      {format(dayObj.date, "d")}
                    </time>
                  </button>
                </div>
              ))}
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
          <div className="planBox flex flex-col place-items-center">
            {workout.length && (
              <div className="flex flex-col py-5 gap-y-6 w-full">
                {workout.map((data) => {
                  const date = weekDates[data.dayOfWeek]?.toLocaleDateString(
                    "en-GB",
                    { day: "2-digit" }
                  );
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
