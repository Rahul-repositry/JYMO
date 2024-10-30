import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MemberRecordBar = ({ locationSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const routes = [
    { path: `/admin/member${locationSearch}`, label: "All" },
    { path: `/admin/member/feerecord${locationSearch}`, label: "Fee Record" },
  ];

  return (
    <div className="flex justify-around bg-white rounded-lg">
      {routes.map((route, index) => {
        const routePathname = new URL(route.path, window.location.origin)
          .pathname;
        return (
          <div
            key={index}
            onClick={() => navigate(route.path)}
            className={`p-3 w-full text-center border-customButton border-opacity-60 font-semibold ${
              location.pathname === routePathname
                ? "text-customButton bg-slate-100"
                : "bg-white text-gray-600"
            } transition-colors duration-300
              ${
                index === 0
                  ? " border-b " // Left button border at bottom
                  : index === 1
                  ? "border border-t-0 border-b border-x" // Middle button with borders on bottom, left, and right
                  : "border-b " // Right button border at bottom
              }`}
          >
            {route.label}
          </div>
        );
      })}
    </div>
  );
};

export default MemberRecordBar;
