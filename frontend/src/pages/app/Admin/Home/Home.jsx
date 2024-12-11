import React, { useEffect, useState } from "react";
import BarComp from "./components/Bar";
import "./home.css";
import PieChart from "./components/PieChart";

import axios from "axios";
import UserSearch from "../../../../components/UserSearch/UserSearch";
import { Link } from "react-router-dom";
const Home = () => {
  const [data, setData] = useState({
    expiringSoon: 0,
    inactive: 0,
    active: 0,
    newlyRegistered: 0,
    paid: 0,
    totalRevenue: 0,
    unpaid: 0,
  });
  const [BarNumArr, setBarNumArr] = useState(Array(7).fill(0));
  const [pieDataArr, setPieDataArr] = useState(Array(3).fill(0));
  const checkInDataToBarNumArr = (checkInData) => {
    const weeklyData = Array(7).fill(0); // Array to hold check-ins for each day

    if (checkInData.checkInArr && checkInData.checkInArr.length > 0) {
      checkInData.checkInArr.forEach((entry) => {
        const checkInDate = new Date(entry.date);
        const dayIndex = (checkInDate.getDay() + 6) % 7; // Adjust to get 0 as Monday, 1 as Tuesday, etc.
        weeklyData[dayIndex] = entry.totalCheckIns; // Fill check-ins for the respective day
      });
    }

    setBarNumArr(weeklyData);
  };

  function getGenderCounts(data) {
    // Default values
    let maleCount = 0;
    let femaleCount = 0;
    let othersCount = 0;

    // Iterate through the data to find counts for each gender
    data.forEach((item) => {
      if (item.gender === "male") {
        maleCount = item.count;
      } else if (item.gender === "female") {
        femaleCount = item.count;
      } else {
        othersCount += item.count; // any other genders fall under 'others'
      }
    });

    // Return the counts in the specified order
    setPieDataArr([maleCount, femaleCount, othersCount]);
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URI}/api/jym/getDashboardStats`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setData(response.data.jymData);
        checkInDataToBarNumArr(response.data.jymData.chqInSummaryOfJym);
        getGenderCounts(response.data.jymData.genderCounts);
      }
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
      <BarComp dataArr={BarNumArr} />
      <PieChart pieDataArr={pieDataArr} />
      <div className="detailCont">
        <div className="detailRow ">
          <Link
            to="/admin/users?statusType=expiringsoon"
            className="block    expirySoon !w-full"
          >
            <div>
              <h2 className="blockTitle text-center !text-red-400">
                Expires In 5 Days
              </h2>
              <p className="value text-center !text-3xl">
                {data.expiringSoon.toString().padStart(4, "0")}
              </p>
            </div>
          </Link>
        </div>
        <div className="detailRow">
          <Link to="/admin/users?statusType=active" className="block activeMem">
            <div>
              <h2 className="blockTitle">Active Members</h2>
              <p className="value">{data.active.toString().padStart(4, "0")}</p>
            </div>
          </Link>
          <Link
            to="/admin/users?statusType=inactive"
            className="block inActiveMem"
          >
            <div>
              <h2 className="blockTitle">In-Active Members</h2>
              <p className="value">
                {data.inactive.toString().padStart(4, "0")}
              </p>
            </div>
          </Link>
        </div>

        <div className="detailRow">
          <Link to="/admin/users?statusType=paid" className="block paidMem">
            <div>
              <h2 className="blockTitle">Paid</h2>
              <p className="value">{data.paid.toString().padStart(4, "0")}</p>
            </div>
          </Link>
          <Link to="/admin/users?statusType=unpaid" className="block unpaidMem">
            <div>
              <h2 className="blockTitle">Unpaid</h2>
              <p className="value">{data.unpaid.toString().padStart(4, "0")}</p>
            </div>
          </Link>
        </div>

        <div className="detailRow">
          <Link
            to="/admin/users?statusType=newlyregistered"
            className="block newlyRegistered"
          >
            <div>
              <h2 className="blockTitle">Newly Registered</h2>
              <p className="value">
                {data.newlyRegistered.toString().padStart(4, "0")}
              </p>
            </div>
          </Link>

          <div className="block totalRevenue">
            <h2 className="blockTitle">Total Revenue</h2>
            <p className="value">
              ₹{data.totalRevenue.toString().padStart(4, "0")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
