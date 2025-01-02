import Logo from "../../images/Logo.svg";
import { Link } from "react-router-dom";
import "./navbar.css";
import { useRef, useState } from "react";
import share from "../../images/share.webp";
import bookmark from "../../images/bookmark.webp";
import save from "../../images/save.webp";
const Navbar = () => {
  const installBtnRef = useRef();
  const [showPopup, setShowPopup] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

  // Function to detect if the browser is Safari
  const detectSafari = () => {
    const userAgent = window.navigator.userAgent;
    const isSafariBrowser =
      /^((?!chrome|android).)*safari/i.test(userAgent) &&
      !userAgent.includes("CriOS");
    setIsSafari(isSafariBrowser);
  };

  const handleShowPopup = () => {
    detectSafari();
    if (isSafari) {
      setShowPopup(true);
    } else {
      // Trigger the installation process for other browsers
      installBtnRef.current.click();
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <div id="divInstallApp" ref={installBtnRef}></div>
      {showPopup && (
        <div className="fixed z-40 inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
          <div className="bg-white  mx-5 p-5 rounded-lg shadow-lg transform transition-all duration-300">
            <h2 className="text-xl font-bold mb-4">Install App on iPhone</h2>
            <p className="mb-4">
              <ol className="list-decimal ml-4">
                <li>Tap the share button at the bottom of the screen.</li>
                <div className="flex justify-center my-2">
                  <img src={share} alt="share" className="max-w-[300px]" />
                </div>
                <li>Select "Add to Home Screen" from the options.</li>
                <div className="flex justify-center my-2">
                  <img src={bookmark} alt="share" className="max-w-[150px]" />
                </div>
                <li>Follow the instructions to save it on your home screen.</li>
                <div className="flex justify-center my-2">
                  <img src={save} alt="share" className="max-w-[200px]" />
                </div>
              </ol>
            </p>
            <button
              onClick={handleClosePopup}
              className="m4 w-full px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div>
        <div className="Navbar flex justify-between items-center bg-white px-8 py-3 border-b-2 border-gray-200 ">
          <div className="logo p-0 cursor-pointer">
            <img src={Logo} alt="Jymo" className="w-14" />
          </div>
          <div className="button sm:text-lg tracking-wide flex place-items-center">
            <div className="links hidden lg:flex gap-4 px-4 text-gray-400">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
            </div>
            <p
              className="hover:bg-orange-200 hover:text-gray-700"
              id="landingPageGetAppBtn"
              style={{ cursor: "pointer" }}
              onClick={handleShowPopup}
            >
              <button
                className="font-bold text-white"
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
