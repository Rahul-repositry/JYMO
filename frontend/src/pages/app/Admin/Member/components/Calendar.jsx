// Calendar.js
import React, { useState } from "react";
import { format, getDay, isSameMonth, isToday } from "date-fns";
import useCalendar from "../useHooks/useCalendar";
import { toast } from "react-toastify";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

const Calendar = ({
  user,
  selectedDate,
  setSelectedDate,
  membershipPreviousEndDate,
}) => {
  const { firstDayCurrentMonth, daysWithStatus, previousMonth, nextMonth } =
    useCalendar(user);

  const handleDateClick = (date) => {
    let realmembershipPreviousEndDate = new Date(membershipPreviousEndDate);

    if (
      date.getTime() <
      realmembershipPreviousEndDate.getTime() - 1000 * 60 * 60 * 24
    ) {
      toast.error("Choose A Date  After  Membership Period Ends.");
      return;
    }
    setSelectedDate(date);
    console.log({
      realmembershipPreviousEndDate,
      date,
    });
  };

  return (
    <>
      <div className="bg-slate-100 my-6 py-5 border border-gray-300">
        <div className="px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
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
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <div key={index}>{day}</div>
            ))}
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
                  onClick={() => handleDateClick(dayObj.date)}
                  className={classNames(
                    isSameMonth(dayObj.date, firstDayCurrentMonth) &&
                      dayObj.status === "present" &&
                      "bg-green-500 text-white",
                    isToday(dayObj.date) && "bg-yellowBox text-white",
                    selectedDate &&
                      selectedDate.getTime() === dayObj.date.getTime() &&
                      "bg-customButton text-black",
                    getDay(dayObj.date) === 0 && "text-redBox",
                    "font-semibold mx-auto flex h-8 w-8 items-center justify-center rounded-lg"
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
    </>
  );
};

export default Calendar;
