import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import axios from "axios";
import "./index.css";
import LoadingScreen from "./components/Loader/LoadingScreen.jsx";
import { setObjectInLocalStorage } from "./utils/helperFunc.js";
import Loader from "./components/Loader/Loader.jsx";

// Lazy load components for better performance
const LandingPage = lazy(() => import("./pages/website/LandingPage.jsx"));
const PrivacyPolicy = lazy(() => import("./pages/website/PrivacyPolicy.jsx"));
const TermsCondition = lazy(() => import("./pages/website/TermsCondition.jsx"));
const About = lazy(() => import("./pages/website/About.jsx"));
const AppNavbar = lazy(() => import("./pages/app/User/Navbar/Navbar.jsx"));
const Main = lazy(() => import("./pages/app/User/SignIn/Main.jsx"));
const LogIn = lazy(() => import("./pages/app/User/SignIn/LogIn.jsx"));
const ForgotPassword = lazy(() =>
  import("./pages/app/User/SignIn/ForgotPassword.jsx")
);
const ResetPass = lazy(() => import("./pages/app/User/SignIn/ResetPass.jsx"));
const Home = lazy(() => import("./pages/app/User/Home/Home.jsx"));
const BottomNavigation = lazy(() =>
  import("./components/BottomNavigation/BottomNavigation.jsx")
);
const Calendar = lazy(() => import("./pages/app/User/Calendar/Calendar.jsx"));
const EditWorkout = lazy(() =>
  import("./components/workoutPlan/EditWorkout.jsx")
);
const Scanner = lazy(() => import("./pages/app/User/Scanner/Scanner.jsx"));
const Success = lazy(() => import("./pages/app/User/Scanner/Success.jsx"));
const Myqr = lazy(() => import("./pages/app/User/Scanner/Myqr.jsx"));
const ScannerProtected = lazy(() =>
  import("./pages/app/User/Scanner/ScannerProtected.jsx")
);
const Profile = lazy(() => import("./pages/app/User/Profile/Profile.jsx"));
const UpdateWrapper = lazy(() =>
  import("./pages/app/User/Profile/UpdateWrapper.jsx")
);
const PastRecords = lazy(() =>
  import("./pages/app/User/Profile/PastRecords.jsx")
);
const ProfileOutlet = lazy(() =>
  import("./pages/app/User/Profile/ProfileOutlet.jsx")
);
const WaitList = lazy(() => import("./pages/app/WaitList.jsx"));

// Admin routes - lazy loaded
const AdSignup = lazy(() => import("./pages/app/Admin/Auth/Signup.jsx"));
const AdLogin = lazy(() => import("./pages/app/Admin/Auth/Login.jsx"));
const AdForgot = lazy(() => import("./pages/app/Admin/Auth/ForgotPass.jsx"));
const AdHome = lazy(() => import("./pages/app/Admin/Home/Home.jsx"));
const AdJymQr = lazy(() => import("./pages/app/Admin/JymQr/JymQr.jsx"));
const AdScanner = lazy(() =>
  import("./pages/app/Admin/AdScanner/AdScanner.jsx")
);
const Member = lazy(() => import("./pages/app/Admin/Member/Member.jsx"));
const FeeRecord = lazy(() => import("./pages/app/Admin/Member/FeeRecord.jsx"));
const Users = lazy(() => import("./pages/app/Admin/Users/Users.jsx"));
const AdProfile = lazy(() => import("./pages/app/Admin/Profile/Profile.jsx"));
const Admins = lazy(() => import("./pages/app/Admin/Profile/Admins.jsx"));
const EditJym = lazy(() => import("./pages/app/Admin/Profile/EditJym.jsx"));
const ErrorFace = lazy(() => import("./pages/app/Error.jsx"));

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

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URI,
  withCredentials: true,
  timeout: 10000, // Set timeout to prevent hanging requests
});

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Memoized fetch functions
  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await apiClient.get("/api/user");
      if (response.data.success) {
        setObjectInLocalStorage("user", response.data.user);
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const fetchJymDetails = useCallback(async () => {
    try {
      const response = await apiClient.get("/api/jym/gymDetails");
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
    } finally {
      setIsLoading(false);
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    // Only fetch data if not on unprotected routes
    if (!UNPROTECTED_ROUTES.includes(location.pathname)) {
      if (!location.pathname.includes("admin")) {
        fetchUserDetails();
      } else {
        fetchJymDetails();
      }
    } else {
      // For unprotected routes, finish loading faster
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, fetchUserDetails, fetchJymDetails]);

  const applyNavbarStyles = !EXCLUDE_PATHS_NAVBAR.includes(location.pathname);
  const applyBottomNavStyles = !EXCLUDE_PATHS_BOTTOM_NAV.includes(
    location.pathname
  );

  if (isLoading) {
    return <LoadingScreen onLoadComplete={() => setIsLoading(false)} />;
  }
  // if (isLoading) {
  //   return <Loader/>;
  // }

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
          {applyNavbarStyles && (
            <Suspense fallback={""}>
              <AppNavbar />
            </Suspense>
          )}
          <Suspense fallback={<Loader />}>
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
          </Suspense>
          {applyBottomNavStyles && (
            <Suspense fallback={""}>
              <BottomNavigation />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
