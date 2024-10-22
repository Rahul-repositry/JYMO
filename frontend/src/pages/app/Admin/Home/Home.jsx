import React, { useEffect } from "react";
import BarComp from "./components/Bar";
import "./home.css";
import PieChart from "./components/PieChart";
import Scanner from "../../../../images/scanner.svg";
import axios from "axios";
const Home = () => {
  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URI}/api/jym/getDashboardStats`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="adminHome px-5 mb-4">
      <div className="search py-4">
        <div className="relative">
          <input
            type="text"
            id="search"
            className="input-field bg-gray-50 !m-0 border border-orange-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500  w-full p-2.5"
            placeholder="Search Member"
            style={{ paddingRight: "50px" }}
            // value={formData.password}
            // onChange={handleChange}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            // onClick={togglePasswordVisibility}
          >
            <svg
              fill="currentColor"
              className="text-darkBlack"
              height="20px"
              width="20px"
              version="1.1"
              id="Capa_1"
              viewBox="0 0 488.4 488.4"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <g>
                  <g>
                    <path d="M0,203.25c0,112.1,91.2,203.2,203.2,203.2c51.6,0,98.8-19.4,134.7-51.2l129.5,129.5c2.4,2.4,5.5,3.6,8.7,3.6 s6.3-1.2,8.7-3.6c4.8-4.8,4.8-12.5,0-17.3l-129.6-129.5c31.8-35.9,51.2-83,51.2-134.7c0-112.1-91.2-203.2-203.2-203.2 S0,91.15,0,203.25z M381.9,203.25c0,98.5-80.2,178.7-178.7,178.7s-178.7-80.2-178.7-178.7s80.2-178.7,178.7-178.7 S381.9,104.65,381.9,203.25z"></path>{" "}
                  </g>
                </g>
              </g>
            </svg>
          </button>
        </div>
      </div>
      <BarComp />
      <PieChart />
      <div className="detailCont">
        <div className="detailRow ">
          <div className="block    newlyRegistered !w-full">
            <h2 className="blockTitle text-center !text-red-400">
              Expires In 5 Days
            </h2>
            <p className="value text-center !text-3xl">0012</p>
          </div>
        </div>
        <div className="detailRow">
          <div className="block activeMem">
            <h2 className="blockTitle">Active Members</h2>
            <p className="value">0092</p>
          </div>
          <div className="block inActiveMem">
            <h2 className="blockTitle">In-Active Members</h2>
            <p className="value">0032</p>
          </div>
        </div>

        <div className="detailRow">
          <div className="block paidMem">
            <h2 className="blockTitle">Paid</h2>
            <p className="value">0062</p>
          </div>
          <div className="block unpaidMem">
            <h2 className="blockTitle">Unpaid</h2>
            <p className="value">0022</p>
          </div>
        </div>

        <div className="detailRow">
          <div className="block newlyRegistered">
            <h2 className="blockTitle">Newly Registered</h2>
            <p className="value">0012</p>
          </div>
          <div className="block totalRevenue">
            <h2 className="blockTitle">Total Revenue</h2>
            <p className="value">₹22,899</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
