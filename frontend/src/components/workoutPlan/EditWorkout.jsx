import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import InputField from "../InputFeild/InputField";

// Custom Input Field Component

// Exercise Plan Component
const ExercisePlanDiv = ({
  plan,
  index,
  handleInputChange,
  handleRemovePlan,
}) => {
  return (
    <div className="relative containerExercisePlan flex flex-col bg-white border border-gray-400 w-full px-5 py-8 my-5 sm:p-10 gap-8 rounded-md">
      <span
        className="absolute right-[20px] top-[15px] cursor-pointer"
        onClick={() => handleRemovePlan(index)}
      >
        ❌
      </span>
      <InputField
        name={`exercise-${index}`}
        label="Exercise - name"
        value={plan.exercise}
        onChange={(e) => handleInputChange(e, index, "exercise")}
      />
      <InputField
        name={`sets-${index}`}
        label="Sets"
        value={plan.sets}
        onChange={(e) => handleInputChange(e, index, "sets")}
      />
      <InputField
        name={`reps-${index}`}
        label="Reps"
        type="number"
        value={plan.reps}
        onChange={(e) => handleInputChange(e, index, "reps")}
      />
      <InputField
        name={`duration-${index}`}
        label="Duration - 00 min"
        type="number"
        value={plan.duration}
        onChange={(e) => handleInputChange(e, index, "duration")}
      />
    </div>
  );
};

const EditWorkout = () => {
  const [selectedDay, setSelectedDay] = useState("");
  const [title, setTitle] = useState("");
  const [exercisePlans, setExercisePlans] = useState([]);

  const fetchWorkoutDataByDay = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URI}/api/workout/getworkoutbyday/${selectedDay}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.workoutPlans.length > 0) {
        let data = response.data.workoutPlans[0];

        setTitle(data.title);
        setExercisePlans(data.exercisePlan);
      } else {
        // Clear fields if no data is found

        setTitle("");
        setExercisePlans([{ exercise: "", sets: "", reps: "", duration: "" }]);
      }

      return response.data;
    } catch (err) {
      console.error("Error fetching workout data ");
      // Clear fields if no data is found
      setTitle("");
      setExercisePlans([{ exercise: "", sets: "", reps: "", duration: "" }]);
      return null;
    }
  };

  // Fetch data based on selected day
  useEffect(() => {
    if (selectedDay) {
      // Replace with your API request
      fetchWorkoutDataByDay();
    }
  }, [selectedDay]);

  // Handle input change for title and exercise plans
  const handleInputChange = (e, index, field) => {
    const { name, value } = e.target;
    if (name === "title") {
      setTitle(value);
    } else {
      const updatedPlans = [...exercisePlans];

      updatedPlans[index][field] = value;
      setExercisePlans(updatedPlans);
    }
  };

  // Handle adding a new exercise plan
  const handleAddPlan = () => {
    setExercisePlans([
      ...exercisePlans,
      { exercise: "", sets: "", reps: "", duration: "" },
    ]);
  };

  // Handle removing an exercise plan
  const handleRemovePlan = (index) => {
    const updatedPlans = [...exercisePlans];
    updatedPlans.splice(index, 1);
    setExercisePlans(updatedPlans);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate all inputs are filled
    if (
      !title ||
      exercisePlans.some(
        (plan) => !plan.exercise || !plan.sets || !plan.reps || !plan.duration
      )
    ) {
      toast.error("Please fill in all fields");
      return;
    } else if (!selectedDay) {
      toast.error("Please select a day");
      return;
    } else if (!exercisePlans.length > 0) {
      toast.error("Please create atleast one exercise ");
      return;
    }

    // Convert the data to the specified schema and send to backend
    const workoutData = {
      dayOfWeek: selectedDay,
      title,
      exercisePlan: exercisePlans,
    };

    // Replace with your API request to save the data
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/workout/manageworkout`,
        workoutData,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setTitle("");
        setExercisePlans([{ exercise: "", sets: "", reps: "", duration: "" }]);
        return;
      }

      return;
    } catch (err) {
      console.error("Error fetching workout data ", err);

      return null;
    }
  };

  return (
    <div className="px-5">
      <div className="days my-4">
        <label
          htmlFor="day-select"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Choose a Day:
        </label>
        <select
          id="day-select"
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option value="" disabled>
            Choose a Day
          </option>
          <option value="sun">Sunday</option>
          <option value="mon">Monday</option>
          <option value="tue">Tuesday</option>
          <option value="wed">Wednesday</option>
          <option value="thu">Thursday</option>
          <option value="fri">Friday</option>
          <option value="sat">Saturday</option>
        </select>
      </div>

      <div className="mt-10">
        <InputField
          name="title"
          label="Workout - Title"
          value={title}
          onChange={handleInputChange}
        />

        <div className="my-5 exercisePlan block mb-2 text-sm font-medium text-gray-900">
          <p className="my-7 text-lg">Exercise Plan :</p>

          {exercisePlans.map((plan, index) => (
            <ExercisePlanDiv
              key={index}
              plan={plan}
              index={index}
              handleInputChange={handleInputChange}
              handleRemovePlan={handleRemovePlan}
            />
          ))}

          <div className="addBtn">
            <button
              onClick={handleAddPlan}
              className="text-customButton border rounded-lg w-full py-2 my-3 border-customButton"
              style={{ border: "1px solid" }}
            >
              Add Exercise
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-customButton w-full py-2 rounded-lg text-white my-3"
      >
        Submit
      </button>
    </div>
  );
};

export default EditWorkout;
