import React from "react";
import UpdateUser from "./UpdateUser";
import { SignupUserDataProvider } from "../../../context/context";

const UpdateWrapper = () => {
  return (
    <SignupUserDataProvider>
      <UpdateUser />
    </SignupUserDataProvider>
  );
};

export default UpdateWrapper;
