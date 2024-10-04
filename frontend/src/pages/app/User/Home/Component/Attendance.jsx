import React from "react";

import clock from "../../../../../images/tabler_clock.svg";

import circleTick from "../../../../../images/charm_circle-tick.svg";
import crossCircle from "../../../../../images/cross_circle.svg";
import { formatDate } from "date-fns";

const Days = ({ arr }) => {
  return arr.map((data, index) => (
    <div
      key={index}
      className={`day min-w-[70px] min-h-[80px] flex gap-1 rounded-xl border ${
        data.status === "present"
          ? "bg-greenBox border-gray-300"
          : data.status === "absent"
          ? "bg-redBox text-white"
          : "border-slate-600 border-2 "
      } flex-col place-content-center place-items-center`}
    >
      <p className="text">{data.day}</p>
      <img
        src={
          data.status === "present"
            ? circleTick
            : data.status === "absent"
            ? crossCircle
            : clock
        }
        alt="icon"
        className="w-5"
      />
    </div>
  ));
};

const Attendance = ({ attendancePercentage, attendanceArr }) => {
  return (
    <>
      <div className="attendanceBox border border-slate-400 bg-yellowBox flex rounded-2xl  p-2 max-w-screen-custom-md500  min-h-24 place-content-center place-items-center relative ">
        <div className="attendance flex flex-col place-items-center">
          <p className="text-2xl text-lightBlack pb-1">
            {attendancePercentage}%
          </p>
          <p className="text-sm text-lightBlack ">
            Attendance Of {formatDate(new Date(), "MMM")} Month
          </p>
        </div>
      </div>
      <div className="workoutDays">
        <h2 className="text-lightBlack text-xl font-medium pt-8 pb-2">
          Workout Days
        </h2>
        <div
          className="workoutAttendanceDays flex gap-3"
          style={{ width: "calc(100% + 40px)" }}
        >
          <Days arr={attendanceArr} />
        </div>
      </div>
    </>
  );
};

export default Attendance;
