import React, { useState } from "react";
import bicep from "../../images/bicep.svg";
import edit from "../../images/edit.svg";
import clock from "../../images/tabler_clock.svg";
import { useLocation } from "react-router-dom/dist/umd/react-router-dom.development";
import Exercises from "./Exercises";
const WorkoutPlan = ({ data, date }) => {
  const { dayOfWeek, title, exercisePlan, userId } = data;
  const totalTime = exercisePlan.reduce((acc, curr) => acc + curr.duration, 0);
  const [showDetail, setshowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const location = useLocation();
  if (location.pathname === "/calender") {
    setShowEdit(true);
  }
  const showDetailtoggle = (e) => {
    e.stopPropagation();
    setshowDetail((prev) => !prev);
  };
  return (
    <>
      <div
        className="flex border border-lightBlack  justify-between rounded-xl w-full min-w-[300px] max-w-[460px]  overflow-hidden"
        onClick={showDetailtoggle}
      >
        <div className="flex ">
          <div className="date w-[70px] relative flex flex-col place-items-start place-items-center px-3 pb-4">
            <h2 className="text-zinc-400 pt-4">{dayOfWeek.toUpperCase()}</h2>
            <p className="text-redBox">{date}</p>
            <div className="absolute w-[3px] h-full bg-yellowBox right-0"></div>
          </div>
          <div className="details  px-3 py-1">
            <div className="title flex  gap-2 py-2">
              <img src={bicep} alt="biceps" className="w-7" />
              <h2
                className={`text-zinc-500 ${
                  !showDetail
                    ? `w-[150px] h-[35px] whitespace-nowrap overflow-hidden text-ellipsis `
                    : ""
                }`}
              >
                {title}
              </h2>
            </div>

            {showDetail && (
              <div className="flex flex-col gap-1 my-2 pl-2">
                {exercisePlan.map((exercise) => {
                  return (
                    <Exercises
                      exerciseData={exercise}
                      key={exercise.exercise}
                    />
                  );
                })}
              </div>
            )}

            <div className="totalTime flex py-2">
              <img src={clock} alt="clock" className="w-5 opacity-40" />

              <span className="text-zinc-600 pl-1">{totalTime}&nbsp;min</span>
            </div>
          </div>
        </div>
        {showEdit && (
          <div className="edit flex place-items-center">
            <div className="svgCont bg-yellowBox  rounded-md py-1 px-2 translate-x-2">
              <img src={edit} alt="edit" className="w-9 -translate-x-1" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WorkoutPlan;
