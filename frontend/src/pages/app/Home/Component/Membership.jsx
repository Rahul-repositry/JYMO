import React from "react";
import { formatDate } from "date-fns";

const Membership = ({ user, membership }) => {
  return (
    <div
      className={`box ${
        membership.expired ? "bg-redBox" : "bg-yellowBox"
      }  flex border border-slate-400 rounded-2xl justify-between px-4 py-2 max-w-screen-custom-md500  min-h-24 place-content-center  `}
    >
      <div className="imgAndExpiryDetails flex place-items-center">
        <div className="img p-2">
          <img
            src={
              user?.img ||
              "https://jymo.s3.ap-south-1.amazonaws.com/userProfileImg/05b8aecb079968b9386383d30cfea4446f76b1781722583225465"
            }
            alt="user"
            referrerPolicy="no-referrer"
            className="rounded-md w-10 border-2 border-white"
          />
        </div>
        <div
          className={`text font-medium  text-lg ${
            membership.expired ? "text-white" : "text-lightBlack"
          }`}
        >
          <p>
            {membership.expired ? "Expired" : "ExpiresIn"} :{" "}
            <span>{membership.days} days</span>
          </p>
        </div>
      </div>
      <div
        className={`date  self-end text-xs font-medium   ${
          membership.expired ? "text-white" : "text-lightBlack"
        }`}
      >
        <p>
          <span className="text-xs text-stone-600">
            {membership.endDate
              ? formatDate(membership.endDate, "dd-MMM-yyyy")
              : "--"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Membership;
