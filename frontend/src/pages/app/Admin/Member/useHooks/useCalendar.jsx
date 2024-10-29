// useCalendar.js
import { useState } from "react";
import { add, format, getDay, parse, startOfToday } from "date-fns";
import useAttendance from "../../../User/Calendar/CustomHooks/useAttendance";
// import useAttendance from "./useAttendance";

const useCalendar = (user) => {
  const today = startOfToday();
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  const daysWithStatus = useAttendance(
    currentMonth,
    firstDayCurrentMonth,
    user
  );

  const previousMonth = () => {
    const firstDayPreviousMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPreviousMonth, "MMM-yyyy"));
  };

  const nextMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  };

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

  return {
    currentMonth,
    firstDayCurrentMonth,
    daysWithStatus,
    previousMonth,
    nextMonth,
    getWeekDates,
  };
};

export default useCalendar;
