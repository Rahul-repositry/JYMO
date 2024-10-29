import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";
import {
  capitalizeFLetter,
  getObjectFromLocalStorage,
} from "../../../../utils/helperFunc";
import "./JymQr.css";

const JymQr = () => {
  const [qrData, setQrData] = useState("");

  useEffect(() => {
    let jymDetails = getObjectFromLocalStorage("adminJym");

    if (jymDetails) {
      setQrData({
        _id: jymDetails._id,
        jymId: jymDetails.jymUniqueId,
        name: jymDetails.name,
        app: "jymo",
      });
    }
  }, []);

  const handleDownload = () => {
    const screenshotElement = document.querySelector(".screenshot");
    toPng(screenshotElement)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "jym-qr-code.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error("Error generating image:", error);
      });
  };

  let jymName = qrData?.name ? capitalizeFLetter(qrData.name) : "";
  return (
    <>
      <div className="qrWrapper JymQr flex flex-col  px-8">
        <div className="screenshot mt-10">
          <div className="qrCont bg-yellowBox flex flex-col  place-items-center  place-content-center  rounded-2xl border border-slate-400   ">
            <div className="name text-xl py-5 font-medium">{jymName}</div>
            <div className="qrCont">
              <div className="border-[5px] rounded-xl p-2 border-black inline-block">
                <QRCodeSVG
                  value={JSON.stringify(qrData)}
                  level="M" // Error correction level: L, M, Q, H
                  size={200} // Size of the QR code
                />
              </div>
            </div>
            <div className="text">
              <p className="max-w-[250px] text-center pb-5 pt-2 text-sm">
                Quickly scan to mark attendance.
              </p>
            </div>
          </div>
          <div className="qrBox border my-5 border-slate-400 bg-yellowBox flex rounded-2xl  p-2 max-w-screen-custom-md500  min-h-24 place-content-center place-items-center relative ">
            <div className="attendance flex flex-col place-items-center">
              <p className="text-2xl text-lightBlack pb-1">{qrData.jymId}</p>
              <p className="text-sm text-lightBlack ">- : JUID : -</p>
            </div>
          </div>
        </div>

        <div className="contha ">
          <p className="text-2xl text-center my-2 font-medium text-lightBlack">
            Download Scanner :
          </p>
          <div
            className="download w-[100px] h-[100px]  bg-gray-100 border border-gray-500 rounded-full mx-auto flex place-items-center place-content-center cursor-pointer"
            onClick={handleDownload}
          >
            <svg
              width="50px"
              height="50px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.5"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 14.25C3.41421 14.25 3.75 14.5858 3.75 15C3.75 16.4354 3.75159 17.4365 3.85315 18.1919C3.9518 18.9257 4.13225 19.3142 4.40901 19.591C4.68577 19.8678 5.07435 20.0482 5.80812 20.1469C6.56347 20.2484 7.56459 20.25 9 20.25H15C16.4354 20.25 17.4365 20.2484 18.1919 20.1469C18.9257 20.0482 19.3142 19.8678 19.591 19.591C19.8678 19.3142 20.0482 18.9257 20.1469 18.1919C20.2484 17.4365 20.25 16.4354 20.25 15C20.25 14.5858 20.5858 14.25 21 14.25C21.4142 14.25 21.75 14.5858 21.75 15V15.0549C21.75 16.4225 21.75 17.5248 21.6335 18.3918C21.5125 19.2919 21.2536 20.0497 20.6517 20.6516C20.0497 21.2536 19.2919 21.5125 18.3918 21.6335C17.5248 21.75 16.4225 21.75 15.0549 21.75H8.94513C7.57754 21.75 6.47522 21.75 5.60825 21.6335C4.70814 21.5125 3.95027 21.2536 3.34835 20.6517C2.74643 20.0497 2.48754 19.2919 2.36652 18.3918C2.24996 17.5248 2.24998 16.4225 2.25 15.0549C2.25 15.0366 2.25 15.0183 2.25 15C2.25 14.5858 2.58579 14.25 3 14.25Z"
                fill="#1C274C"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 16.75C12.2106 16.75 12.4114 16.6615 12.5535 16.5061L16.5535 12.1311C16.833 11.8254 16.8118 11.351 16.5061 11.0715C16.2004 10.792 15.726 10.8132 15.4465 11.1189L12.75 14.0682V3C12.75 2.58579 12.4142 2.25 12 2.25C11.5858 2.25 11.25 2.58579 11.25 3V14.0682L8.55353 11.1189C8.27403 10.8132 7.79963 10.792 7.49393 11.0715C7.18823 11.351 7.16698 11.8254 7.44648 12.1311L11.4465 16.5061C11.5886 16.6615 11.7894 16.75 12 16.75Z"
                fill="#1C274C"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default JymQr;
