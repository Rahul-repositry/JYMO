import axios from "axios";

export const fetchMembershipData = async (currentJymId, membershipCache) => {
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

export const fetchAttendanceData = async (
  currentJymId,
  startDate,
  endDate,
  attendanceCache
) => {
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

export const fetchWorkoutPlans = async (workoutCache) => {
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
