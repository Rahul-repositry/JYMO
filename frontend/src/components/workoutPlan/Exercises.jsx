import React, { useState } from "react";

const Exercises = ({ exerciseData }) => {
  const { exercise, sets, reps, duration } = exerciseData;
  const [showDetails, setshowDetail] = useState(false);
  const showDetailtoggle = (e) => {
    e.stopPropagation();
    setshowDetail((prev) => !prev);
  };
  return (
    <div className="details relative pl-4 text-zinc-400">
      <span className="absolute w-3 h-3 top-2 -left-1 bg-zinc-300 rounded-full"></span>
      <span
        className="absolute w-[3px]  bottom-[2px]  bg-zinc-300 rounded-full"
        style={{ left: "0.5px", height: "calc(100% - 11px)" }}
      ></span>
      <h2
        className="text-zinc-500 text-[16px] inline-block"
        onClick={showDetailtoggle}
      >
        {exercise}
      </h2>
      {showDetails && (
        <div>
          <p className="text-[16px]">{sets}&nbsp;sets</p>
          <p className="text-[16px]">{reps}&nbsp;reps</p>
          <p className="text-[16px]">{duration}&nbsp;min</p>
        </div>
      )}
    </div>
  );
};

export default Exercises;
