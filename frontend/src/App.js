import { Route, Routes } from "react-router-dom";
import "./index.css";
import LandingPage from "./pages/LandingPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsCondition from "./pages/TermsCondition";
import About from "./pages/About";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/termsCondition" element={<TermsCondition />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
