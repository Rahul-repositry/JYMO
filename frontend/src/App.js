import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import "./index.css";
import LandingPage from "./pages/website/LandingPage.jsx";
import PrivacyPolicy from "./pages/website/PrivacyPolicy.jsx";
import TermsCondition from "./pages/website/TermsCondition.jsx";
import About from "./pages/website/About.jsx";
import AppNavbar from "./pages/app/User/Navbar/Navbar.jsx";
import Main from "./pages/app/User/SignIn/Main.jsx";
import LogIn from "./pages/app/User/SignIn/LogIn.jsx";
// import ForgotPass from "./pages/app/User/SignIn/ForgotPass.jsx";
import ForgotPassword from "./pages/app/User/SignIn/ForgotPassword.jsx";
import ResetPass from "./pages/app/User/SignIn/ResetPass.jsx";
import Home from "./pages/app/User/Home/Home.jsx";
import BottomNavigation from "./components/BottomNavigation/BottomNavigation.jsx";
import Calendar from "./pages/app/User/Calendar/Calendar.jsx";
import EditWorkout from "./components/workoutPlan/EditWorkout.jsx";
import Scanner from "./pages/app/User/Scanner/Scanner.jsx";
import Success from "./pages/app/User/Scanner/Success.jsx";
import Myqr from "./pages/app/User/Scanner/Myqr.jsx";
import ScannerProtected from "./pages/app/User/Scanner/ScannerProtected.jsx";
import Profile from "./pages/app/User/Profile/Profile.jsx";
import UpdateWrapper from "./pages/app/User/Profile/UpdateWrapper.jsx";
import PastRecords from "./pages/app/User/Profile/PastRecords.jsx";
import { setObjectInLocalStorage } from "./utils/helperFunc.js";

// Admin routes
import AdSignup from "./pages/app/Admin/Auth/Signup.jsx";
import AdLogin from "./pages/app/Admin/Auth/Login.jsx";
import AdForgot from "./pages/app/Admin/Auth/ForgotPass.jsx";
import AdHome from "./pages/app/Admin/Home/Home.jsx";
import AdJymQr from "./pages/app/Admin/JymQr/JymQr.jsx";
import AdScanner from "./pages/app/Admin/AdScanner/AdScanner.jsx";
import Member from "./pages/app/Admin/Member/Member.jsx";
import FeeRecord from "./pages/app/Admin/Member/FeeRecord.jsx";
import Users from "./pages/app/Admin/Users/Users.jsx";
import AdProfile from "./pages/app/Admin/Profile/Profile.jsx";
import Admins from "./pages/app/Admin/Profile/Admins.jsx";
import EditJym from "./pages/app/Admin/Profile/EditJym.jsx";
import ErrorFace from "./pages/app/Error.jsx";
import ProfileOutlet from "./pages/app/User/Profile/ProfileOutlet.jsx";
import WaitList from "./pages/app/WaitList.jsx";

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
  "/admin/login",
  "/admin/signup",
  "/signup",
  "/forgotpassword",
  "/resetpassword",
];

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URI}/api/user`,
          {
            withCredentials: true,
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
    };

    const fetchJymDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URI}/api/jym/gymDetails`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setObjectInLocalStorage("adminJym", response.data.jymData);
        }
      } catch (err) {
        console.error("Error fetching gym details:", err);
        if (location.pathname.includes("/admin/forgotpassword")) {
          navigate("/admin/forgotpassword");
        } else if (location.pathname.includes("/admin/signup")) {
          navigate("/admin/signup");
        } else {
          navigate("/admin/login");
        }
      }
    };

    if (!UNPROTECTED_ROUTES.includes(location.pathname)) {
      if (!location.pathname.includes("admin")) {
        fetchUserDetails();
      } else {
        fetchJymDetails();
      }
    }
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
          className={`wrapper min-h-screen overflow-hidden bg-white ${
            applyBottomNavStyles ? "pb-20" : ""
          }`}
        >
          {applyNavbarStyles && <AppNavbar />}
          <Routes>
            {/* User Flow */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/editworkout" element={<EditWorkout />} />
            <Route path="/scanner/*" element={<ScannerProtected />}>
              <Route index element={<Scanner />} />

              <Route path="success" element={<Success />} />
              <Route path="myqr" element={<Myqr />} />
            </Route>
            <Route path="/profile/*" element={<ProfileOutlet />}>
              <Route index element={<Profile />} />
              <Route path="updateuser" element={<UpdateWrapper />} />
              <Route path="updategmail" element={<UpdateWrapper />} />
              <Route path="updatephone" element={<UpdateWrapper />} />
              <Route path="pastrecords" element={<PastRecords />} />
            </Route>
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/termscondition" element={<TermsCondition />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<Main />} />
            <Route path="/login" element={<LogIn />} />
            {/* <Route path="/forgotpassword" element={<ForgotPass />} /> */}
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/resetpassword" element={<ResetPass />} />
            <Route path="/waitlist" element={<WaitList />} />

            {/* Admin Flow */}
            <Route path="/admin/*">
              <Route path="signup" element={<AdSignup />} />
              <Route path="login" element={<AdLogin />} />
              <Route path="forgotpassword" element={<AdForgot />} />
              <Route path="home" element={<AdHome />} />
              <Route path="jymqr" element={<AdJymQr />} />
              <Route path="scanner" element={<AdScanner />} />
              <Route path="users" element={<Users />} />
              <Route path="member" element={<Member />} />
              <Route path="member/feerecord" element={<FeeRecord />} />
              <Route path="profile">
                <Route index element={<AdProfile />} />
                <Route path="admins" element={<Admins />} />
                <Route path="editjymdetails" element={<EditJym />} />
              </Route>
            </Route>
            <Route path="*" element={<ErrorFace />} />
          </Routes>
          {applyBottomNavStyles && <BottomNavigation />}
        </div>
      </div>
    </div>
  );
}

export default App;
