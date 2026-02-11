import React, { useCallback, useEffect, useState } from "react";
import { capitalizeFLetter } from "../../../../../utils/helperFunc";
import { format, startOfDay, isSameDay } from "date-fns";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { User } from "lucide-react";

const UserDetailCont = ({ user }) => {
  const navigate = useNavigate();
  const todayStart = startOfDay(new Date());
  const lastCheckInStart = user.lastCheckIn
    ? startOfDay(new Date(user.lastCheckIn))
    : false;

  const [isAttendanceMarked, setIsAttendanceMarked] = useState(
    user.lastCheckIn
      ? isSameDay(todayStart, lastCheckInStart) ||
          todayStart <= lastCheckInStart
      : false,
  );

  const handleMarkAttendance = useCallback(async () => {
    if (!user.lastCheckIn) {
      toast.error("Click edit icon to register user.");
      return;
    }
    if (!isAttendanceMarked) {
      try {
        let res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URI}/api/attendance/attendancebyadmin`,
          { userId: user.userId },
          { withCredentials: true },
        );
        if (res.data.success) {
          toast.success("Attendance is marked");
          setIsAttendanceMarked(true);
          return;
        }
        // Optionally, you can update the UI or notify the user of success
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Error marking attendance",
        );
        console.error("Error marking attendance:", error);
      }
    }
  }, [isAttendanceMarked, user.userId]);

  useEffect(() => {
    setIsAttendanceMarked(
      user.lastCheckIn
        ? isSameDay(todayStart, lastCheckInStart) ||
            todayStart <= lastCheckInStart
        : false,
    );
  }, [user]);

  const handleCall = useCallback(() => {
    window.location.href = `tel:${user.phone}`;
  }, [user.phone]);

  const handleMessage = useCallback(() => {
    const phoneNumber = user.phone.replace(/^\+/, ""); // Ensure the phone number is in the correct format
    window.location.href = `https://wa.me/${phoneNumber}`;
  }, [user.phone]);

  const handleEdit = useCallback(() => {
    navigate(`/admin/member?userId=${user.userId}`);
  }, [navigate, user.userId]);

  return (
    <div>
      <div
        className={`wrapperCont border border-slate-800 flex flex-col gap-5 px-3 py-5 my-2 rounded-3xl `}
      >
        {!user.lastCheckIn && (
          <p className="text-center font-semibold">
            Click on the edit icon to register
          </p>
        )}
        <div className="showDetails m-1 flex justify-between">
          <div className="imgAnddate flex place-items-center gap-3">
            <div className="rounded-full border">
              <div className="img w-12 h-12 flex items-center justify-center border border-gray-400 rounded-full overflow-hidden">
                {user?.img ? (
                  <img
                    src={user?.img}
                    alt="gym user"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="text-gray-400 w-6 h-6" />
                )}
              </div>
            </div>
            <div className="nameAndDate flex flex-col">
              <p className="text-xl py-1">
                {capitalizeFLetter(user.username || "-Name-")}
              </p>
              <p className="text-xs">
                {user.startDate
                  ? format(new Date(user.startDate), "dd-MMM")
                  : "--"}{" "}
                to{" "}
                {user.endDate ? format(new Date(user.endDate), "dd-MMM") : "--"}
              </p>
            </div>
          </div>
          <div className="remaining border flex gap-1 place-content-center place-items-center flex-col border-red-400 text-red-500 rounded-xl text-xs p-2">
            <p>Chq-in At:</p>
            <p>
              {user.lastCheckIn
                ? format(new Date(user.lastCheckIn), "dd-MMM")
                : "--"}
            </p>
          </div>
        </div>
        <div className="ClickDetails flex justify-around text-slate-700">
          <div
            className={`date border rounded-full p-3 px-5 border-gray-500 text-center ${
              isAttendanceMarked
                ? "cursor-not-allowed bg-green-500 text-white"
                : "cursor-pointer"
            }`}
            onClick={handleMarkAttendance}
          >
            <p>{format(new Date(), "d")}</p>
            <p className="text-xs">{format(new Date(), "MMM")}</p>
          </div>
          <div
            className="call border rounded-full p-3 px-4 flex place-items-center border-gray-500 cursor-pointer"
            onClick={handleCall}
          >
            <svg
              className="fill-current"
              height="30px"
              width="30px"
              version="1.1"
              id="Capa_1"
              viewBox="0 0 473.806 473.806"
            >
              <g>
                <g>
                  <path
                    d="M374.456,293.506c-9.7-10.1-21.4-15.5-33.8-15.5c-12.3,0-24.1,5.3-34.2,15.4l-31.6,31.5c-2.6-1.4-5.2-2.7-7.7-4
			c-3.6-1.8-7-3.5-9.9-5.3c-29.6-18.8-56.5-43.3-82.3-75c-12.5-15.8-20.9-29.1-27-42.6c8.2-7.5,15.8-15.3,23.2-22.8
			c2.8-2.8,5.6-5.7,8.4-8.5c21-21,21-48.2,0-69.2l-27.3-27.3c-3.1-3.1-6.3-6.3-9.3-9.5c-6-6.2-12.3-12.6-18.8-18.6
			c-9.7-9.6-21.3-14.7-33.5-14.7s-24,5.1-34,14.7c-0.1,0.1-0.1,0.1-0.2,0.2l-34,34.3c-12.8,12.8-20.1,28.4-21.7,46.5
			c-2.4,29.2,6.2,56.4,12.8,74.2c16.2,43.7,40.4,84.2,76.5,127.6c43.8,52.3,96.5,93.6,156.7,122.7c23,10.9,53.7,23.8,88,26
			c2.1,0.1,4.3,0.2,6.3,0.2c23.1,0,42.5-8.3,57.7-24.8c0.1-0.2,0.3-0.3,0.4-0.5c5.2-6.3,11.2-12,17.5-18.1c4.3-4.1,8.7-8.4,13-12.9
			c9.9-10.3,15.1-22.3,15.1-34.6c0-12.4-5.3-24.3-15.4-34.3L374.456,293.506z M410.256,398.806
			C410.156,398.806,410.156,398.906,410.256,398.806c-3.9,4.2-7.9,8-12.2,12.2c-6.5,6.2-13.1,12.7-19.3,20
			c-10.1,10.8-22,15.9-37.6,15.9c-1.5,0-3.1,0-4.6-0.1c-29.7-1.9-57.3-13.5-78-23.4c-56.6-27.4-106.3-66.3-147.6-115.6
			c-34.1-41.1-56.9-79.1-72-119.9c-9.3-24.9-12.7-44.3-11.2-62.6c1-11.7,5.5-21.4,13.8-29.7l34.1-34.1c4.9-4.6,10.1-7.1,15.2-7.1
			c6.3,0,11.4,3.8,14.6,7c0.1,0.1,0.2,0.2,0.3,0.3c6.1,5.7,11.9,11.6,18,17.9c3.1,3.2,6.3,6.4,9.5,9.7l27.3,27.3
			c10.6,10.6,10.6,20.4,0,31c-2.9,2.9-5.7,5.8-8.6,8.6c-8.4,8.6-16.4,16.6-25.1,24.4c-0.2,0.2-0.4,0.3-0.5,0.5
			c-8.6,8.6-7,17-5.2,22.7c0.1,0.3,0.2,0.6,0.3,0.9c7.1,17.2,17.1,33.4,32.3,52.7l0.1,0.1c27.6,34,56.7,60.5,88.8,80.8
			c4.1,2.6,8.3,4.7,12.3,6.7c3.6,1.8,7,3.5,9.9,5.3c0.4,0.2,0.8,0.5,1.2,0.7c3.4,1.7,6.6,2.5,9.9,2.5c8.3,0,13.5-5.2,15.2-6.9
			l34.2-34.2c3.4-3.4,8.8-7.5,15.1-7.5c6.2,0,11.3,3.9,14.4,7.3c0.1,0.1,0.1,0.1,0.2,0.2l55.1,55.1
			C420.456,377.706,420.456,388.206,410.256,398.806z"
                  />
                  <path
                    d="M256.056,112.706c26.2,4.4,50,16.8,69,35.8s31.3,42.8,35.8,69c1.1,6.6,6.8,11.2,13.3,11.2c0.8,0,1.5-0.1,2.3-0.2
			c7.4-1.2,12.3-8.2,11.1-15.6c-5.4-31.7-20.4-60.6-43.3-83.5s-51.8-37.9-83.5-43.3c-7.4-1.2-14.3,3.7-15.6,11
			S248.656,111.506,256.056,112.706z"
                  />
                  <path
                    d="M473.256,209.006c-8.9-52.2-33.5-99.7-71.3-137.5s-85.3-62.4-137.5-71.3c-7.3-1.3-14.2,3.7-15.5,11
			c-1.2,7.4,3.7,14.3,11.1,15.6c46.6,7.9,89.1,30,122.9,63.7c33.8,33.8,55.8,76.3,63.7,122.9c1.1,6.6,6.8,11.2,13.3,11.2
			c0.8,0,1.5-0.1,2.3-0.2C469.556,223.306,474.556,216.306,473.256,209.006z"
                  />
                </g>
              </g>
            </svg>
          </div>
          <div
            className="message border rounded-full px-4 flex place-items-center p-3 border-gray-500 cursor-pointer"
            onClick={handleMessage}
          >
            <svg
              height="30px"
              width="30px"
              version="1.1"
              id="Capa_2"
              viewBox="0 0 473 473"
              className="fill-current"
            >
              <g>
                <g>
                  <path
                    d="M403.581,69.3c-44.7-44.7-104-69.3-167.2-69.3s-122.5,24.6-167.2,69.3c-86.4,86.4-92.4,224.7-14.9,318
          c-7.6,15.3-19.8,33.1-37.9,42c-8.7,4.3-13.6,13.6-12.1,23.2s8.9,17.1,18.5,18.6c4.5,0.7,10.9,1.4,18.7,1.4
          c20.9,0,51.7-4.9,83.2-27.6c35.1,18.9,73.5,28.1,111.6,28.1c61.2,0,121.8-23.7,167.4-69.3c44.7-44.7,69.3-104,69.3-167.2
          S448.281,114,403.581,69.3z M384.481,384.6c-67.5,67.5-172,80.9-254.2,32.6c-5.4-3.2-12.1-2.2-16.4,2.1c-0.4,0.2-0.8,0.5-1.1,0.8
          c-27.1,21-53.7,25.4-71.3,25.4h-0.1c20.3-14.8,33.1-36.8,40.6-53.9c1.2-2.9,1.4-5.9,0.7-8.7c-0.3-2.7-1.4-5.4-3.3-7.6
          c-73.2-82.7-69.4-208.7,8.8-286.9c81.7-81.7,214.6-81.7,296.2,0C466.181,170.1,466.181,302.9,384.481,384.6z"
                  />
                  <circle cx="236.381" cy="236.5" r="16.6" />
                  <circle cx="321.981" cy="236.5" r="16.6" />
                  <circle cx="150.781" cy="236.5" r="16.6" />
                </g>
              </g>
            </svg>
          </div>
          <div
            className="edit border rounded-full p-3 px-4 text-transparent flex place-items-center border-gray-500 cursor-pointer"
            onClick={handleEdit}
          >
            <svg
              width="30px"
              height="30px"
              viewBox="0 0 24 24"
              className=" fill-current  "
            >
              <path
                d="M18.9445 9.1875L14.9445 5.1875M18.9445 9.1875L13.946 14.1859C13.2873 14.8446 12.4878 15.3646 11.5699 15.5229C10.6431 15.6828 9.49294 15.736 8.94444 15.1875C8.39595 14.639 8.44915 13.4888 8.609 12.562C8.76731 11.6441 9.28735 10.8446 9.946 10.1859L14.9445 5.1875M18.9445 9.1875C18.9445 9.1875 21.9444 6.1875 19.9444 4.1875C17.9444 2.1875 14.9445 5.1875 14.9445 5.1875M20.5 12C20.5 18.5 18.5 20.5 12 20.5C5.5 20.5 3.5 18.5 3.5 12C3.5 5.5 5.5 3.5 12 3.5"
                stroke="#000000"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailCont;
