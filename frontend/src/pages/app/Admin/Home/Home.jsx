import React, { useEffect } from "react";
import BarComp from "./components/Bar";
import "./home.css";
import PieChart from "./components/PieChart";

import axios from "axios";
import UserSearch from "../../../../components/UserSearch/UserSearch";
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
      <UserSearch />
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
