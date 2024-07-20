import Scanqr from "../../../images/scanqr.webp";
import SignIn from "../../../images/signIn.webp";
import markDone from "../../../images/markDone.webp";

import "./HowWorks.css";
const HowWorks = () => {
  return (
    <div className="min-w-screen   bg-gray-50 flex items-center justify-center py-5">
      <div className="howWorks w-full bg-white border-t border-b border-gray-200 px-5 py-16 md:py-24 text-gray-800overflow-hidden">
        <div className="heading  ">
          <h2 className="text-6xl text-center md:text-7xl font-bold mb-10 text-gray-600">
            How it&apos;s Works
          </h2>
          <div className="text-center mb-10">
            <span className="inline-block w-1 h-1 rounded-full bg-indigo-500 ml-1"></span>
            <span className="inline-block w-3 h-1 rounded-full bg-indigo-500 ml-1"></span>
            <span className="inline-block w-40 h-1 rounded-full bg-indigo-500"></span>
            <span className="inline-block w-3 h-1 rounded-full bg-indigo-500 ml-1"></span>
            <span className="inline-block w-1 h-1 rounded-full bg-indigo-500 ml-1"></span>
          </div>
        </div>
        <div className="boxes flex flex-col gap-10 place-items-center custom-md500:flex-row custom-md500:flex-wrap place-content-center">
          <div className="signIn custom-md500:max-w-[300px] custom-md800:max-w-none">
            <img
              src={SignIn}
              alt="signin"
              style={{ boxShadow: "#c9c9c9 0px 0px 10px 1px" }}
            />
          </div>
          <div className="scan   custom-md500:max-w-[300px] custom-md800:max-w-none ">
            <img
              src={Scanqr}
              alt="Scan qr"
              style={{ boxShadow: "#c9c9c9 0px 0px 10px 1px" }}
              className=""
            />
          </div>

          <div className="Done custom-md500:max-w-[300px] custom-md800:max-w-none">
            <img
              src={markDone}
              alt="Done"
              style={{ boxShadow: "#c9c9c9 0px 0px 10px 1px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowWorks;
