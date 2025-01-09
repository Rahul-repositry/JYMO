import React from "react";
import WorkoutPlan from "../../../../../components/workoutPlan/WorkoutPlan.jsx";
import CustomButton from "../../../../../components/Button/Button.jsx";
import workoutPlanImg from "../../../../../images/workoutPlan.webp";
import { getWeekDates } from "../utils/utils.js";
import { Link } from "react-router";

const WorkoutPlans = ({ workout }) => {
  const weekDates = getWeekDates();

  return (
    <div className="plan">
      <div className="planContainer text-lightBlack text-xl font-medium pt-6 pb-2">
        <h2>Your Workout Plans !</h2>
        <div className="planBox flex flex-col   place-items-center ">
          {workout.length ? (
            <div className="flex flex-col py-5 gap-y-6 w-full">
              {workout?.length &&
                workout.map((data) => {
                  const date = weekDates[data.dayOfWeek]?.toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                    }
                  );
                  return <WorkoutPlan key={data._id} data={data} date={date} />;
                })}
            </div>
          ) : (
            <div className="planBox2 flex flex-col  py-2  place-items-center ">
              <img
                src={workoutPlanImg}
                alt="workout plan"
                className="pt-7 pb-2"
                style={{ maxWidth: "250px" }}
              />
              <CustomButton fullWidth={true}>
                {" "}
                <Link to="/calendar"> Let's Create Plan</Link>
              </CustomButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlans;
