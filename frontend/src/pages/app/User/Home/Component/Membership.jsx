import React from "react";
import { format as formatDate, differenceInDays } from "date-fns";

const Membership = ({ user, membership }) => {
  const remainingDays = membership.endDate
    ? differenceInDays(
        new Date(membership.endDate),
        new Date(membership.lastChqInDate)
      )
    : 0;
  console.log({
    endDate: new Date(membership.endDate),
    last: new Date(membership.lastChqInDate),
    membership,
  });
  const isInactiveBeforeExpiry = membership.Inactive && remainingDays > 0;
  const daysLabel = isInactiveBeforeExpiry
    ? "Remaining Days"
    : remainingDays <= 0
    ? "Expired"
    : "Expires In";
  // console.log({ remainingDays, isInactiveBeforeExpiry, daysLabel, membership });
  return (
    <div
      className={`box ${
        isInactiveBeforeExpiry
          ? "bg-yellowBox"
          : remainingDays <= 0
          ? "bg-redBox"
          : "bg-yellowBox"
      } flex flex-col border border-slate-400 rounded-2xl justify-between px-4 py-2 max-w-screen-custom-md500 pt-4 min-h-24 place-content-center`}
    >
      {membership?.Inactive && (
        <div className="flex justify-center">
          <div className="text-xs text-red-500 border border-red-500 px-3 py-1 bg-white rounded-full">
            Inactive -{" "}
            {formatDate(new Date(membership.lastChqInDate), "dd-MMM")}
          </div>
        </div>
      )}
      <div className="imgAndExpiryDetails flex items-center">
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
          className={`text font-medium text-lg ${
            remainingDays <= 0 ? "text-white" : "text-lightBlack"
          }`}
        >
          <p>
            {daysLabel}: <span>{Math.max(remainingDays, 1)} days</span>
          </p>
        </div>
      </div>
      <div
        className={`date self-end text-xs font-medium ${
          remainingDays <= 0 ? "text-white" : "text-lightBlack"
        }`}
      >
        <p>
          <span
            className={`text-xs ${
              remainingDays <= 0 ? "text-white" : "text-stone-600"
            }`}
          >
            {membership.startDate
              ? formatDate(new Date(membership.startDate), "dd-MMM")
              : "--"}{" "}
            -{" "}
            {membership.endDate
              ? formatDate(new Date(membership.endDate), "dd-MMM")
              : "--"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Membership;
