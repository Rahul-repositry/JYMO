import React, { forwardRef } from "react";
import { Link } from "react-router-dom";

const Reader = forwardRef((props, ref) => {
  return (
    <div className="reader-container pt-10">
      {/* My QR Code Link */}
      <Link to="/admin/jymqr">
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
            <p>Jym QR Code</p>
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
        Scan the QR in the given area to quickly renew, register,
        register-again.
      </p>
    </div>
  );
});

export default React.memo(Reader);
