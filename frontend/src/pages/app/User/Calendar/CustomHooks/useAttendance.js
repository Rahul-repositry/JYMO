import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  startOfDay,
  endOfMonth,
  parseISO,
  getDay,
  eachDayOfInterval,
} from "date-fns";

const useAttendance = (currentMonth, firstDayCurrentMonth, user) => {
  const [daysWithStatus, setDaysWithStatus] = useState([]);
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const attendanceMonthCache = useRef({});
  const daysWithStatusCache = useRef({});

  useEffect(() => {
    const initializeDaysWithStatus = () => {
      const days = eachDayOfInterval({
        start: firstDayCurrentMonth,
        end: endOfMonth(firstDayCurrentMonth),
      });
      return days.map((date) => ({ date, status: "pending" }));
    };

    const fetchAttendanceMonthData = async (
      currentJymId,
      startDate,
      endDate
    ) => {
      if (attendanceMonthCache.current[currentMonth]) {
        return attendanceMonthCache.current[currentMonth];
      }
      try {
        let response;
        if (user) {
          response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URI}/api/attendance/getattendancebydateByAdmin`,
            { userId: user._id, startDate, endDate },
            { withCredentials: true }
          );
        } else {
          response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URI}/api/attendance/getattendancebydate`,
            { jymId: currentJymId, startDate, endDate },
            { withCredentials: true }
          );
        }

        attendanceMonthCache.current[currentMonth] = response.data;
        return response.data;
      } catch (err) {
        console.error("Error fetching attendance data: ", err);
        return { success: false, attendance: [] };
      }
    };

    const updateDaysWithAttendance = (attendanceData) => {
      if (attendanceData?.length > 0) {
        if (daysWithStatusCache.current[currentMonth]) {
          setDaysWithStatus(daysWithStatusCache.current[currentMonth]);
          return;
        }
        const updatedDays = initializeDaysWithStatus().map((dayObj) => {
          const dayDate = startOfDay(dayObj.date).getTime().toString();
          const attendanceRecord = attendanceData.find((att) => {
            let chqDate = startOfDay(parseISO(att?.checkIn))
              .getTime()
              .toString();
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
        setDaysWithStatus(initializeDaysWithStatus());
      }
    };

    const loadCalendarData = async () => {
      if (hasFetchedData) return; // Prevent further requests if data has already been fetched for the current month
      const startDate = firstDayCurrentMonth.toISOString();
      const endDate = endOfMonth(firstDayCurrentMonth).toISOString();
      const attendanceData = await fetchAttendanceMonthData(
        "66b494c994292de725fe1a0e", // replace with actual jymId
        startDate,
        endDate
      );

      if (attendanceData?.success) {
        updateDaysWithAttendance(attendanceData.attendance);
      } else {
        updateDaysWithAttendance([]);
      }
      setHasFetchedData(true); // Mark data as fetched for the current month
    };

    loadCalendarData();
  }, [currentMonth, firstDayCurrentMonth, hasFetchedData]);

  useEffect(() => {
    setHasFetchedData(false); // Reset the fetched data state when the month changes
  }, [currentMonth]);

  return daysWithStatus;
};

export default useAttendance;
