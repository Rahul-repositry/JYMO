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
import EditWorkout from "./components/workoutPlan/EditWorkout.jsx";

function App() {
  const location = useLocation();

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
    "signup",
    "/forgotpassword",
    "/resetpassword",
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
            applyStylesForBottomNavigation ? "pb-16 " : ""
          }`}
        >
          {applyStyles && <Navbar />}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/editworkout" element={<EditWorkout />} />
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
