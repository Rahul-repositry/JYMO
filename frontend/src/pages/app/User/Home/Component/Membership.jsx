import React from "react";
import { format as formatDate, differenceInDays } from "date-fns";

const Membership = ({ user, membership }) => {
  const remainingDays = membership.endDate
    ? differenceInDays(new Date(membership.endDate), new Date())
    : 0;

  const isInactiveBeforeExpiry = membership.Inactive && remainingDays > 0;
  const daysLabel = isInactiveBeforeExpiry
    ? "Remaining Days"
    : remainingDays <= 0
    ? "Expired"
    : "Expires In";

  return (
    <>
      <div
        className={`box ${
          isInactiveBeforeExpiry
            ? "bg-yellowBox"
            : remainingDays <= 0
            ? "bg-redBox"
            : "bg-yellowBox"
        } flex flex-col border border-slate-400 rounded-2xl justify-between px-4 py-2 max-w-screen-custom-md500  min-h-24 place-content-center`}
      >
        <div className="flex justify-between items-center">
          {/* Inactive Status */}
          <div className="inactive grow">
            {membership?.Inactive && (
              <div className="flex justify-center">
                <div className="text-xs text-red-500 border border-red-500 px-3 py-1 bg-white rounded-full">
                  Inactive -{" "}
                  {formatDate(new Date(membership.lastChqInDate), "dd-MMM")}
                </div>
              </div>
            )}
          </div>

          {/* UID */}
          <div className="Uid flex items-center">
            <p
              className={`text-xs font-medium ${
                remainingDays <= 0 ? "text-white" : "text-stone-600"
              } `}
            >
              UID -{" "}
            </p>
            <span
              className={`${
                remainingDays <= 0 ? "text-white" : "text-stone-600"
              } ml-1`}
            >
              {user?.userUniqueId}
            </span>
          </div>
        </div>

        <div className="imgAndExpiryDetails flex items-center">
          <div className="img p-2">
            <img
              src={user?.img || process.env.REACT_APP_DEFAULT_IMG}
              alt="user"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.target.onerror = null; // Prevents an infinite loop if the fallback also fails)
                e.target.src = process.env.REACT_APP_DEFAULT_IMG;
              }}
              className="rounded-md w-10 border-2 border-white"
            />
          </div>
          <div
            className={`text font-medium text-lg ${
              remainingDays <= 0 ? "text-white" : "text-lightBlack"
            }`}
          >
            <p>
              {daysLabel}: <span>{Math.max(remainingDays)} days</span>
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
    </>
  );
};

export default Membership;
