import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  capitalizeFLetter,
  getObjectFromLocalStorage,
} from "../../../../utils/helperFunc";
import "./myqr.css";

const Myqr = () => {
  const [qrData, setQrData] = useState("");

  useEffect(() => {
    let user = getObjectFromLocalStorage("user");

    if (user) {
      setQrData({
        userId: user._id,
        UID: user.userUniqueId,
        username: user.username,
        app: "jymo",
        role: "user",
      });
    }
  }, []);

  let userName = qrData?.username ? capitalizeFLetter(qrData.username) : "";
  return (
    <>
      <div className="qrWrapper myqr flex flex-col gap-10 px-8">
        <div className="qrCont bg-yellowBox flex flex-col  place-items-center  place-content-center  rounded-2xl border border-slate-400 mt-10  ">
          <div className="name text-xl py-5 font-medium">{userName}</div>
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
              Quickly scan to pay fee and mark attendance.{" "}
            </p>
          </div>
        </div>
        <div className="qrBox border border-slate-400 bg-yellowBox flex rounded-2xl  p-2 max-w-screen-custom-md500  min-h-24 place-content-center place-items-center relative ">
          <div className="attendance flex flex-col place-items-center">
            <p className="text-2xl text-lightBlack pb-1">{qrData.UID}</p>
            <p className="text-sm text-lightBlack ">- : UID : -</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Myqr;
