import React, { useEffect, useState } from "react";
import UpdateUser from "./UpdateUser";
import { SignupUserDataProvider } from "../../../context/context";
import { useLocation } from "react-router-dom";
import UpdateGmail from "./UpdateGmail.jsx";
import UpdatePhone from "./UpdatePhone.jsx";

const UpdateWrapper = () => {
  let location = useLocation();
  let locationPageArr = location.pathname.split("/");
  let locationLastWord = locationPageArr[locationPageArr.length - 1];
  console.log(locationLastWord);
  const [updateuser, setUpdateUser] = useState("");
  const [updategmail, setUpdategmail] = useState("");
  const [updatephone, setUpdatephone] = useState("");

  useEffect(() => {
    if (locationLastWord === "updateuser") {
      setUpdateUser(locationLastWord);
    } else if (locationLastWord === "updategmail") {
      setUpdategmail(locationLastWord);
    } else if (locationLastWord === "updatephone") {
      setUpdatephone(locationLastWord);
    }
  }, []);

  return (
    <SignupUserDataProvider>
      {updateuser && <UpdateUser />}
      {updategmail && <UpdateGmail />}
      {updatephone && <UpdatePhone />}
    </SignupUserDataProvider>
  );
};

export default UpdateWrapper;
