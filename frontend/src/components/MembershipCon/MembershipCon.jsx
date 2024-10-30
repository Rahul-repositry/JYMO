import { format } from "date-fns";
import React from "react";
import { formatTime } from "../../utils/helperFunc";

const MembershipCon = ({ membership }) => {
  const { createdAt, endDate, jymId, status } = membership;
  const { name, addressLocation, phoneNumbers } = jymId;

  return (
    <div className="jymCont text-lightBlack bg-stone-100 p-4 flex flex-col gap-3 mx-5 rounded-xl my-4 border border-stone-400">
      <div className="dateTime flex justify-between text-sm">
        <p className="date">{format(new Date(createdAt), "dd-MMM-yyyy")}</p>
        <p className="time">{formatTime(new Date(createdAt))}</p>
      </div>
      <div className="details">
        <div className="jymName text-lg font-medium">
          <h2>{name} gym</h2>
        </div>
        <div className="jymAddress text-sm text-stone-500 pt-1">
          <p>
            {addressLocation.state} - {addressLocation.city} -{" "}
            {addressLocation.address}
          </p>
        </div>
      </div>

      <div className="phoneNumber flex flex-col">
        <div className="status text-xl font-medium">
          {status?.active?.value === true ? "Active" : "Inactive"}
        </div>
        <div className="phone text-sm pt-1">
          <p> Contacts - {phoneNumbers.join(" | ")} </p>
        </div>
      </div>
      <div className="endDate flex justify-between font-medium tracking-normal">
        <p>Ends At : {format(new Date(endDate), "dd-MMM-yyyy")}</p>
        <p className="font-bold text-xl pr-2">&#8377;{membership.amount}</p>
      </div>
    </div>
  );
};

export default MembershipCon;
