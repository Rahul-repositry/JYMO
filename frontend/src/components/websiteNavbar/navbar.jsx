import Logo from "../../images/Logo.svg";
import { Link } from "react-router-dom";
import "./navbar.css";
import { useRef, useState } from "react";
const Navbar = () => {
  const installBtnRef = useRef();
  const [showPopup, setShowPopup] = useState(false);

  const handleShowPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <div id="divInstallApp" ref={installBtnRef}></div>
      {showPopup && (
        <div className="fixed z-40 inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
          <div className="bg-white p-5 rounded-lg shadow-lg transform transition-all duration-300">
            <h2 className="text-xl font-bold mb-4">Get App</h2>
            <p className="mb-4">Get our app for the best experience!</p>
            <button
              onClick={() => {
                installBtnRef.current.click();
                handleClosePopup();
              }}
              className="px-4 py-2 font-bold text-white bg-[#f78c68] rounded hover:bg-orange-300"
            >
              Get App
            </button>
            <button
              onClick={handleClosePopup}
              className="ml-4 px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div>
        <div className="Navbar flex justify-between items-center bg-white px-8 py-3 border-b-2 border-gray-200 ">
          <div className="logo p-0 cursor-pointer">
            <img src={Logo} alt="Jymo" className="w-16" />
          </div>
          <div className="button sm:text-lg tracking-wide flex place-items-center">
            <div className="links hidden lg:flex gap-4 px-4 text-gray-400">
              <Link to="/privacyPolicy">Privacy Policy</Link>

              <Link to="/termsCondition">Terms & Conditions</Link>
            </div>
            <p className="hover:bg-orange-200 hover:text-gray-700">
              <button
                onClick={handleShowPopup}
                className="font-bold text-white "
                style={{ padding: "0px" }}
              >
                Get App
              </button>
            </p>
          </div>
          <div className="links hidden"></div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
