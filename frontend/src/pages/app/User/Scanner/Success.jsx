import { format } from "date-fns";
import React from "react";

const Success = () => {
  let today = new Date();
  return (
    <>
      <div className=" flex flex-col h-full place-content-center place-items-center  translate-y-[35%]">
        <h2 className="text-xl font-semibold ">{format(today, "PPPP")}</h2>

        <dotlottie-player
          src="https://lottie.host/f6ff6c61-3f24-4082-8366-a37a3e17d9a2/7fSQG63zrN.json"
          background="transparent"
          speed="1"
          style={{ width: "300px", height: "300px", display: "block" }}
          loop
          autoplay
        ></dotlottie-player>
        <div className="text animate-fade">
          <h2 className="text-2xl text-slate-600 font-semibold">
            Attendance Marked
          </h2>
        </div>
      </div>
    </>
  );
};

export default Success;
