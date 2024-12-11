import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  startOfDay,
  endOfMonth,
  parseISO,
  getDay,
  eachDayOfInterval,
} from "date-fns";
import { useLocation } from "react-router-dom";
import { getObjectFromLocalStorage } from "../../../../../utils/helperFunc";

const useAttendance = (currentMonth, firstDayCurrentMonth, user) => {
  const [daysWithStatus, setDaysWithStatus] = useState([]);
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const attendanceMonthCache = useRef({});
  const daysWithStatusCache = useRef({});
  const location = useLocation();
  const jym = getObjectFromLocalStorage("currentJym");
  const adminJym = getObjectFromLocalStorage("adminJym");

  useEffect(() => {
    const initializeDaysWithStatus = () => {
      const days = eachDayOfInterval({
        start: firstDayCurrentMonth,
        end: endOfMonth(firstDayCurrentMonth),
      });
      return days.map((date) => ({
        date,
        status: "pending",
        isMarkedByAdmin: false,
      }));
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
        if (user?._id) {
          response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URI}/api/attendance/getattendancebydateByAdmin`,
            { userId: user._id, startDate, endDate },
            { withCredentials: true }
          );
        } else if (!location.pathname.includes("admin")) {
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
            if (attendanceRecord.mode === "inactive") {
              return {
                ...dayObj,
                status: "inactive",
                isMarkedByAdmin: attendanceRecord?.isMarkedByAdmin,
              };
            } else {
              return {
                ...dayObj,
                status: "registered",
                isMarkedByAdmin: attendanceRecord?.isMarkedByAdmin,
              };
            }
          } else if (getDay(dayObj.date) === 0) {
            return {
              ...dayObj,
              status: "holiday",
              isMarkedByAdmin: attendanceRecord?.isMarkedByAdmin,
            };
          } else {
            return {
              ...dayObj,
              status: "pending",
              isMarkedByAdmin: attendanceRecord?.isMarkedByAdmin,
            };
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

      const currentJymId = location.pathname.includes("admin")
        ? adminJym?._id
        : jym?.jymId;

      const attendanceData = await fetchAttendanceMonthData(
        currentJymId,
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
