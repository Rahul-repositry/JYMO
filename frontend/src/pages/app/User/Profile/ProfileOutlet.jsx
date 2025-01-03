import React from "react";
import { Outlet } from "react-router-dom";

const ProfileOutlet = () => {
  return (
    <div className="nested-routes">
      <Outlet />
    </div>
  );
};

export default ProfileOutlet;
