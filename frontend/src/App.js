import { Route, Routes, useLocation } from "react-router-dom";
import "./index.css";
import LandingPage from "./pages/website/LandingPage";
import PrivacyPolicy from "./pages/website/PrivacyPolicy";
import TermsCondition from "./pages/website/TermsCondition";
import About from "./pages/website/About";

import Navbar from "./pages/app/Navbar/Navbar";
import Main from "./pages/app/SignIn/Main";

function App() {
  const location = useLocation();

  return (
    <>
      <div className=" ">
        {location.pathname !== "/" && <Navbar />}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/termscondition" element={<TermsCondition />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Main />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
