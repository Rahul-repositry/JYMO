import { eachDayOfInterval, getDay, parseISO, isSameDay } from "date-fns";
import {
  getObjectFromLocalStorage,
  setObjectInLocalStorage,
} from "../../../../../utils/helperFunc";

export const getSundaysCountInMonth = (startDate, endDate) => {
  const days = eachDayOfInterval({
    start: new Date(startDate),
    end: new Date(endDate),
  });

  const sundays = days.filter((day) => getDay(day) === 0); // 0 is Sunday in JavaScript

  return sundays.length;
};

export const attendanceOfThisWeek = (attendanceArr) => {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Start of the week (Sunday)
  const endOfWeek = new Date(now.setDate(now.getDate() + 6)); // End of the week (Saturday)

  const weekStatus = [
    { day: "Sun", status: "pending" },
    { day: "Mon", status: "pending" },
    { day: "Tue", status: "pending" },
    { day: "Wed", status: "pending" },
    { day: "Thu", status: "pending" },
    { day: "Fri", status: "pending" },
    { day: "Sat", status: "pending" },
  ];

  const weekAttendance = attendanceArr.filter((attendance) => {
    const checkInDate = new Date(attendance.checkIn);
    return checkInDate >= startOfWeek && checkInDate <= endOfWeek;
  });

  let lastAttendedDay = -1;

  weekAttendance.forEach((attendance) => {
    const checkInDate = new Date(attendance.checkIn);
    const dayOfWeek = checkInDate.getDay();

    weekStatus[dayOfWeek].status = "present";
    lastAttendedDay = dayOfWeek;
  });

  weekStatus.forEach((day, index) => {
    if (index < lastAttendedDay && day.status === "pending") {
      day.status = "absent";
    }
  });

  return weekStatus;
};

export const attendedDaysInPercentage = (sd, ed, arr) => {
  let sundays = getSundaysCountInMonth(sd, ed);
  let totalDays = arr.length;

  let calc = totalDays / (30 - sundays);
  let attendedDaysInPercentage = Math.floor(calc * 100);

  return attendedDaysInPercentage;
};

export const filterUniqueCheckIns = (attendanceArray) => {
  const uniqueCheckIns = [];

  attendanceArray.forEach((record) => {
    const checkInDate = parseISO(record.checkIn);
    const isDuplicate = uniqueCheckIns.some((uniqueRecord) =>
      isSameDay(parseISO(uniqueRecord.checkIn), checkInDate)
    );

    if (!isDuplicate) {
      uniqueCheckIns.push(record);
    }
  });

  return uniqueCheckIns;
};

export const getWeekDates = () => {
  const weekDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat", "sun"];
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

export const calculateDiffOfEndDateAndToday = (membershipEndDate) => {
  console.log(membershipEndDate);
  const membershipEndDateTime = new Date(membershipEndDate).getTime();
  const now = new Date().getTime();
  const diff = membershipEndDateTime - now;
  const days = Math.round(diff / (1000 * 60 * 60 * 24));
  if (days < 0) {
    setDetailsInLocalStorageForUser({ isExpired: true });
  } else {
    setDetailsInLocalStorageForUser({ isExpired: false });
  }
  return days;
};

// set details in localStorage user
export const setDetailsInLocalStorageForUser = (data) => {
  // data : { key : value } format
  const user = getObjectFromLocalStorage("user");
  if (user) {
    const updatedUser = { ...user, ...data };
    setObjectInLocalStorage("user", updatedUser);
  }
};
