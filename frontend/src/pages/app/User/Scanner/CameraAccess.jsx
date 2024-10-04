import React from "react";
import chromeLogo from "../../../../images/chromeLogo.svg";
import safariLogo from "../../../../images/safariLogo.svg";
import edgeLogo from "../../../../images/edgeLogo.svg";
import firefoxLogo from "../../../../images/firefoxLogo.svg";
import operaLogo from "../../../../images/operaLogo.svg";
import samsungLogo from "../../../../images/samsungLogo.svg";

const browserData = [
  {
    name: "Chrome",
    logo: chromeLogo,
    steps: [
      "Open Chrome.",
      "Click on the three-dot menu in the top-right corner.",
      "Go to 'Settings' > 'Privacy and security' > 'Site settings'.",
      "Scroll down to 'Permissions' and click 'Camera'.",
      "Ensure your camera is allowed for the site.",
    ],
  },
  {
    name: "Firefox",
    logo: firefoxLogo,
    steps: [
      "Open Firefox.",
      "Click on the menu button (three lines) in the top-right corner.",
      "Select 'Settings' > 'Privacy & Security'.",
      "Scroll down to 'Permissions' and click on 'Settings…' next to 'Camera'.",
      "Ensure your camera is allowed for the site.",
    ],
  },
  {
    name: "Edge",
    logo: edgeLogo,
    steps: [
      "Open Edge.",
      "Click on the three-dot menu in the top-right corner.",
      "Go to 'Settings' > 'Cookies and site permissions'.",
      "Scroll down to 'All permissions' and click 'Camera'.",
      "Ensure your camera is allowed for the site.",
    ],
  },
  {
    name: "Safari",
    logo: safariLogo,
    steps: [
      "Open Safari.",
      "Click on 'Safari' in the top-left corner, then 'Preferences'.",
      "Go to the 'Websites' tab.",
      "Click on 'Camera' in the sidebar.",
      "Ensure your camera is allowed for the site.",
    ],
  },
  {
    name: "Opera",
    logo: operaLogo,
    steps: [
      "Open Opera.",
      "Click on the Opera icon in the top-left corner.",
      "Go to 'Settings' > 'Advanced' > 'Privacy & Security'.",
      "Scroll down to 'Site Settings' and click 'Camera'.",
      "Ensure your camera is allowed for the site.",
    ],
  },
  {
    name: "Samsung Internet",
    logo: samsungLogo,
    steps: [
      "Open Samsung Internet.",
      "Tap the menu button (three lines) at the bottom-right corner.",
      "Select 'Settings' > 'Sites and downloads'.",
      "Tap on 'Permissions' and then 'Camera'.",
      "Ensure your camera is allowed for the site.",
    ],
  },
];

const CameraAccess = ({ requestCameraPermission }) => {
  return (
    <>
      <div className="bg-gray-50 border border-gray-700 p-5 text-center rounded-lg mx-4 mt-5">
        <p>Grant Permission For Camera.</p>
        <button
          onClick={requestCameraPermission}
          className="w-full bg-customButton text-white rounded-lg my-4"
        >
          Allow Camera Permission
        </button>
      </div>
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-start mb-8 text-customButton ">
          How to enable Camera Permissions
        </h1>
        {browserData.map((browser, index) => (
          <div key={index} className="mb-8">
            <div className="flex items-center space-x-4">
              <img
                src={browser.logo}
                alt={`${browser.name} logo`}
                className="w-10 h-10"
              />
              <h2 className="text-2xl font-semibold text-gray-700">
                {browser.name}
              </h2>
            </div>
            <ul className="mt-4 ml-12 list-disc space-y-2 text-gray-600">
              {browser.steps.map((step, idx) => (
                <li key={idx} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};

export default CameraAccess;
