import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

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
import EditWorkout from "./components/workoutPlan/EditWorkout.jsx";
import Scanner from "./pages/app/Scanner/Scanner.jsx";
import Success from "./pages/app/Scanner/Success.jsx";
import Myqr from "./pages/app/Scanner/Myqr.jsx";
import ScannerProtected from "./pages/app/Scanner/ScannerProtected.jsx";
import Profile from "./pages/app/Profile/Profile.jsx";
import UpdateWrapper from "./pages/app/Profile/UpdateWrapper.jsx";
import PastJyms from "./pages/app/Profile/PastJyms.jsx";

import { setObjectInLocalStorage } from "./utils/helperFunc.js";

// Constants
const UNPROTECTED_ROUTES = [
  "/",
  "/privacypolicy",
  "/termscondition",
  "/about",
  "/signup",
  "/login",
  "/forgotpassword",
  "/resetpassword",
];

const EXCLUDE_PATHS_NAVBAR = [
  "/",
  "/privacypolicy",
  "/termscondition",
  "/about",
];

const EXCLUDE_PATHS_BOTTOM_NAV = [
  "/",
  "/privacypolicy",
  "/termscondition",
  "/about",
  "/login",
  "/signup",
];

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!UNPROTECTED_ROUTES.includes(location.pathname)) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URI}/api/user`,
            {
              withCredentials: true,
              headers: {
                "Cache-Control": "no-cache",
              },
            }
          );
          if (response.data.success) {
            setObjectInLocalStorage("user", response.data.user);
          } else {
            navigate("/login");
          }
        } catch (err) {
          console.error("Error fetching user details:", err);
          navigate("/login");
        }
      }
    };

    fetchUserDetails();
  }, [location.pathname, navigate]);

  const applyNavbarStyles = !EXCLUDE_PATHS_NAVBAR.includes(location.pathname);
  const applyBottomNavStyles = !EXCLUDE_PATHS_BOTTOM_NAV.includes(
    location.pathname
  );

  return (
    <div className={`app ${applyNavbarStyles ? "bg-black" : ""}`}>
      <div
        className={`${
          applyNavbarStyles
            ? "max-w-screen-custom-md500 max-h-screen overflow-scroll mx-auto bg-slate-50"
            : ""
        }`}
      >
        <div
          className={`wrapper min-h-screen bg-white ${
            applyBottomNavStyles ? "pb-20" : ""
          }`}
        >
          {applyNavbarStyles && <Navbar />}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/editworkout" element={<EditWorkout />} />
            <Route
              path="/scanner"
              element={
                <ScannerProtected>
                  <Scanner />
                </ScannerProtected>
              }
            />
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
          {applyBottomNavStyles && <BottomNavigation />}
        </div>
      </div>
    </div>
  );
}

export default App;
