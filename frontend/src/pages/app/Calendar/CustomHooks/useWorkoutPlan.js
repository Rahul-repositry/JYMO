import { useState, useEffect, useRef } from "react";
import axios from "axios";

const useWorkoutPlans = () => {
  const [workout, setWorkout] = useState([]);
  const workoutCache = useRef(null);

  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      if (workoutCache.current) {
        return workoutCache.current;
      }
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URI}/api/workout/getallworkout`,
          { withCredentials: true }
        );
        const sortedWorkoutPlans = sortWorkoutPlans(response.data.workoutPlans);
        workoutCache.current = sortedWorkoutPlans;
        return { success: true, workoutPlans: sortedWorkoutPlans };
      } catch (err) {
        console.error("Error fetching workout plans: ", err);
        return null;
      }
    };

    const loadWorkoutPlans = async () => {
      const workoutPlans = await fetchWorkoutPlans();
      if (workoutPlans && workoutPlans.success) {
        setWorkout(workoutPlans.workoutPlans);
      }
    };

    loadWorkoutPlans();
  }, []);

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
    return workoutPlans.sort(
      (a, b) => dayOfWeekOrder[a.dayOfWeek] - dayOfWeekOrder[b.dayOfWeek]
    );
  };

  return workout;
};

export default useWorkoutPlans;
