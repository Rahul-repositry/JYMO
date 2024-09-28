import { Route, Routes, useLocation } from "react-router-dom";
import "./index.css";
import LandingPage from "./pages/website/LandingPage";
import PrivacyPolicy from "./pages/website/PrivacyPolicy";
import TermsCondition from "./pages/website/TermsCondition";
import About from "./pages/website/About";
import Navbar from "./pages/app/Navbar/Navbar";
import Main from "./pages/app/SignIn/Main";
import LogIn from "./pages/app/SignIn/LogIn";
import ForgotPass from "./pages/app/SignIn/ForgotPass";
import ResetPass from "./pages/app/SignIn/ResetPass";
import Home from "./pages/app/Home/Home.jsx";

import BottomNavigation from "./components/BottomNavigation/BottomNavigation.jsx";
import Calendar from "./pages/app/Calendar/Calendar.jsx";
import Calendar2 from "./pages/app/Calendar/Calendar.jsx";
import EditWorkout from "./components/workoutPlan/EditWorkout.jsx";
import Scanner from "./pages/app/Scanner/Scanner.jsx";
import Success from "./pages/app/Scanner/Success.jsx";
import Myqr from "./pages/app/Scanner/Myqr.jsx";
// import Scanner2 from "./pages/app/Scanner/SolveScannerProb.jsx";
import ScannerProtected from "./pages/app/Scanner/ScannerProtected.jsx";
import { useEffect } from "react";
import {
  getObjectFromLocalStorage,
  setObjectInLocalStorage,
} from "./utils/helperFunc.js";
import Profile from "./pages/app/Profile/Profile.jsx";

import axios from "axios";
import UpdateWrapper from "./pages/app/Profile/UpdateWrapper.jsx";
import PastJyms from "./pages/app/Profile/PastJyms.jsx";

function App() {
  const location = useLocation();

  const fetchUserDetails = async () => {
    try {
      const user = await axios.get(
        `${process.env.REACT_APP_BACKEND_URI}/api/user`,
        {
          withCredentials: true,
          headers: {
            "Cache-Control": "no-cache", // Ensure no caching
          },
        }
      );
      if (user.data.success) {
        setObjectInLocalStorage("user", user.data.user);
      }
      console.log(user);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log("working");
    fetchUserDetails();
  }, []);

  // defines a redux user slice to user everwhere

  // Define the paths where the specific styles should not be applied
  const excludePathsForJymoNavbar = [
    "/",
    "/privacypolicy",
    "/termscondition",
    "/about",
  ];
  const excludePathsBottomNavbar = [
    "/",
    "/privacypolicy",
    "/termscondition",
    "/about",
    "/login",
    "/signup",
  ];

  // Check if the current path is in the excludePaths array
  const applyStyles = !excludePathsForJymoNavbar.includes(location.pathname);
  const applyStylesForBottomNavigation = !excludePathsBottomNavbar.includes(
    location.pathname
  );

  return (
    <div className={`app ${applyStyles ? "bg-black" : ""}`}>
      <div
        className={`${
          applyStyles
            ? "max-w-screen-custom-md500 max-h-screen overflow-scroll mx-auto  bg-slate-50"
            : ""
        }`}
      >
        <div
          className={`wrapper min-h-screen bg-white ${
            applyStylesForBottomNavigation ? "pb-20 " : ""
          }`}
        >
          {applyStyles && <Navbar />}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />

            <Route path="/calendar" element={<Calendar />} />
            <Route path="/calendar2" element={<Calendar2 />} />
            <Route path="/editworkout" element={<EditWorkout />} />
            <Route
              path="/scanner"
              element={
                <ScannerProtected>
                  <Scanner />
                </ScannerProtected>
              }
            />
            {/* <Route path="/scanner2" element={<Scanner2 />} /> */}
            <Route path="/scanner/success" element={<Success />} />
            <Route path="/scanner/myqr" element={<Myqr />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/updateuser" element={<UpdateWrapper />} />
            <Route path="/profile/updategmail" element={<UpdateWrapper />} />
            <Route path="/profile/updatephone" element={<UpdateWrapper />} />
            <Route path="/profile/pastjyms" element={<PastJyms />} />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/termscondition" element={<TermsCondition />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<Main />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/forgotpassword" element={<ForgotPass />} />
            <Route path="/resetpassword" element={<ResetPass />} />
          </Routes>
          {applyStylesForBottomNavigation && <BottomNavigation />}
        </div>
      </div>
    </div>
  );
}

export default App;
