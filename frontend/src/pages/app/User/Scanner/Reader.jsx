// Reader.js
import React, { forwardRef } from "react";
import snd from "../../../../images/snd.svg";
import { Link } from "react-router-dom";

const Reader = forwardRef(
  ({ juid, handleJUIDinput, markAttendanceByJUID }, ref) => {
    return (
      <div className="reader-container pt-10">
        {/* My QR Code Link */}
        <Link to="myqr">
          <div className="myQr flex mb-4  mx-auto gap-3  w-fit   bg-yellowBox  rounded-full p-2 place-items-center">
            <div className="svg ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="none"
              >
                <rect
                  x=".25"
                  y=".25"
                  width="29.5"
                  height="29.5"
                  rx="14.75"
                  fill="#f5f5f5"
                  stroke="#404446"
                  strokeWidth=".5"
                />
                <path
                  d="M16.04 23.081v-1.807h1.809v1.807H16.04zm-1.808-1.807V16.85h1.808v4.424h-1.808zm7.041-3.386v-2.847h1.807v2.847h-1.807zm-1.809-2.847v-1.808h1.809v1.808h-1.809zM8.808 16.85v-1.808h1.808v1.808H8.808zM7 15.041v-1.808h1.807l.001 1.808H7zm8.04-6.232V7h1.808v1.807l-1.808.002zM7.884 11.54h3.655V7.885H7.884v3.655zM7 11.617V7.808a.78.78 0 0 1 .807-.807h3.809a.78.78 0 0 1 .808.807v3.809a.78.78 0 0 1-.808.808H7.807A.78.78 0 0 1 7 11.617zm.884 10.58h3.809v-3.655H7.884v3.655zM7 22.274v-3.809a.78.78 0 0 1 .807-.808h3.963a.78.78 0 0 1 .807.808v3.809a.78.78 0 0 1-.807.807H7.807A.78.78 0 0 1 7 22.274zM18.541 11.54h3.655V7.885h-3.655v3.655zm-.885.077V7.808a.78.78 0 0 1 .808-.807h3.809a.78.78 0 0 1 .807.807v3.809a.78.78 0 0 1-.807.808h-3.809a.78.78 0 0 1-.808-.808zm1.808 11.464v-3.385h-1.808v-1.809h3.617v3.386h1.807v1.807h-3.616zM16.04 16.85v-1.808h3.424v1.808H16.04zm-3.616 0v-1.808h-1.807l-.001-1.808h5.424v1.808h-1.808v1.808h-1.807zm.807-4.424V8.808l1.808.001v1.807h1.808v1.808h-3.617zm-4.155-2.078v-1.27h1.27v1.27h-1.27zm.135 10.522v-1.27h1.27v1.27h-1.27zm10.523-10.523V9.079h1.269v1.27l-1.269-.002z"
                  fill="#000"
                />
              </svg>
            </div>
            <div className="text-lightBlack font-medium pr-1">
              <p>My QR Code</p>
            </div>
          </div>
        </Link>
        {/* QR Code Reader */}
        <div id="reader" ref={ref} width="600px" />

        {/* Instruction Text */}

        <p
          className="text-gray-500 text-sm mx-4  my-3 text-center"
          style={{ lineHeight: "1.7", letterSpacing: "0.3px" }}
        >
          Scan the QR in the given area If not working then type your UID below
          and then snd.
        </p>

        <div className=" inputCont w-72 mx-auto rounded-full border border-blue-gray-300 bg-transparent flex place-items-center justify-around px-2">
          <div className="  text-blue-gray-500">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <rect
                x="0.25"
                y="0.25"
                width="23.5"
                height="23.5"
                rx="11.75"
                fill="#F5F5F5"
                stroke="#404446"
                strokeWidth="0.5"
              />
              <path
                d="M10.0003 11.3337C10.7367 11.3337 11.3337 10.7367 11.3337 10.0003C11.3337 9.26395 10.7367 8.66699 10.0003 8.66699C9.26395 8.66699 8.66699 9.26395 8.66699 10.0003C8.66699 10.7367 9.26395 11.3337 10.0003 11.3337Z"
                stroke="#404446"
                strokeWidth="0.8"
              />
              <path
                d="M12.6668 14.0003C12.6668 14.737 12.6668 15.3337 10.0002 15.3337C7.3335 15.3337 7.3335 14.737 7.3335 14.0003C7.3335 13.2637 8.52683 12.667 10.0002 12.667C11.4735 12.667 12.6668 13.2637 12.6668 14.0003Z"
                stroke="#404446"
                strokeWidth="0.8"
              />
              <path
                d="M18.6668 12.0003C18.6668 14.5143 18.6668 15.7717 17.8855 16.5523C17.1048 17.3337 15.8475 17.3337 13.3335 17.3337H10.6668C8.15283 17.3337 6.8955 17.3337 6.11483 16.5523C5.3335 15.7717 5.3335 14.5143 5.3335 12.0003C5.3335 9.48633 5.3335 8.22899 6.11483 7.44833C6.8955 6.66699 8.15283 6.66699 10.6668 6.66699H13.3335C15.8475 6.66699 17.1048 6.66699 17.8855 7.44833C18.1988 7.76166 18.3862 8.15099 18.4988 8.66699M16.6668 12.0003H14.0002M16.6668 10.0003H13.3335M16.6668 14.0003H14.6668"
                stroke="#404446"
                strokeWidth="0.8"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <input
            className=" py-4 text-lg font-sans w-[180px]  font-normal text-blue-gray-700 outline outline-0 "
            placeholder="Enter JUID here...."
            value={juid}
            onChange={handleJUIDinput}
            type="number"
          />

          <div className="  text-blue-gray-500" onClick={markAttendanceByJUID}>
            <img src={snd} alt="snd img" className=" w-[30px]" />
          </div>
        </div>
      </div>
    );
  }
);

export default React.memo(Reader);
