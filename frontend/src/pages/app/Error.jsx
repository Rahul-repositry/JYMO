import React from "react";
import { Link } from "react-router";

const ErrorFace = () => {
  return (
    <div className="flex flex-col items-center   font-openSans">
      <div className="face relative min-w-[220px] min-h-[220px] max-w-[320px] max-h-[320px] w-[50vw] h-[30vh] bg-white border-[4px] border-[#383A41] rounded-[10px] mt-[100px] sm:scale-[0.8] sm:mt-[40px]">
        <div className="band absolute min-w-[260px]  max-w-[360px] w-[60vw] h-[27px] bg-transparent border-[4px] border-[#383A41] rounded-[5px] left-[-25px] top-[50px]">
          <div className="red h-[33%] w-full bg-[#EB6D6D]"></div>
          <div className="white h-[33%] w-full bg-white"></div>
          <div className="blue h-[33%] w-full bg-[#5E7FDC]"></div>
        </div>
        <div className="eyes flex justify-center gap-[20px] mt-[100px]">
          <div className="eye w-[30px] h-[15px] border-[7px] border-[#383A41] border-t-[7px] border-b-0 rounded-t-[22px]"></div>
          <div className="eye w-[30px] h-[15px] border-[7px] border-[#383A41] border-t-[7px] border-b-0 rounded-t-[22px]"></div>
        </div>
        <div className="dimples flex justify-between w-[180px] mt-[15px] mx-auto">
          <div className="w-[10px] h-[10px] rounded-full bg-[#EB6D6D]/40"></div>
          <div className="w-[10px] h-[10px] rounded-full bg-[#EB6D6D]/40"></div>
        </div>
        <div className="mouth w-[40px] h-[5px] bg-[#383A41] rounded-[5px] mt-[25px] mx-auto"></div>
      </div>
      <h1 className="text-center text-[#383A41] font-extrabold text-[2em] sm:text-[2em] sm:px-[20px] pt-[20px]">
        Oops! Something went wrong!
      </h1>
      <div className="mx-5 w-[80%] ">
        <Link to="/home">
          <div className="btn text-center text-white bg-[#5E7FDC] hover:bg-[#5E7FDC]/80 font-medium py-[20px] px-[40px]   rounded-[5px] mt-[30px] sm:mt-[60px] mb-[50px] cursor-pointer transition-all duration-200">
            Return to Home
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ErrorFace;
