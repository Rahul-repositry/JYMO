import { useState, useEffect, useRef } from "react";
import axios from "axios";

const generateid = () => Math.random().toString(16).substr(2, 24);

const transformedWorkoutPlans = [
  {
    _id: generateid(),
    dayOfWeek: "sun",
    title: "Exercise Day",
    exercisePlan: [
      {
        duration: 0,
        exercise: "Exercise Name",
        reps: 0,
        sets: 0,
        _id: generateid(),
      },
    ],
  },
  {
    _id: generateid(),
    dayOfWeek: "mon",
    title: "Exercise Day",
    exercisePlan: [
      {
        duration: 0,
        exercise: "Exercise Name",
        reps: 0,
        sets: 0,
        _id: generateid(),
      },
    ],
  },
  {
    _id: generateid(),
    dayOfWeek: "tue",
    title: "Exercise Day",
    exercisePlan: [
      {
        duration: 0,
        exercise: "Exercise Name",
        reps: 0,
        sets: 0,
        _id: generateid(),
      },
    ],
  },
  {
    _id: generateid(),
    dayOfWeek: "wed",
    title: "Exercise Day",
    exercisePlan: [
      {
        duration: 0,
        exercise: "Exercise Name",
        reps: 0,
        sets: 0,
        _id: generateid(),
      },
    ],
  },
  {
    _id: generateid(),
    dayOfWeek: "thu",
    title: "Exercise Day",
    exercisePlan: [
      {
        duration: 0,
        exercise: "Exercise Name",
        reps: 0,
        sets: 0,
        _id: generateid(),
      },
    ],
  },
  {
    _id: generateid(),
    dayOfWeek: "fri",
    title: "Exercise Day",
    exercisePlan: [
      {
        duration: 0,
        exercise: "Exercise Name",
        reps: 0,
        sets: 0,
        _id: generateid(),
      },
    ],
  },
  {
    _id: generateid(),
    dayOfWeek: "sat",
    title: "Exercise Day",
    exercisePlan: [
      {
        duration: 0,
        exercise: "Exercise Name",
        reps: 0,
        sets: 0,
        _id: generateid(),
      },
    ],
  },
];

const useWorkoutPlans = () => {
  const [workout, setWorkout] = useState(transformedWorkoutPlans);
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
