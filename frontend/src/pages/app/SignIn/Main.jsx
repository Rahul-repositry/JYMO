import React, { useState } from "react";
import SignUp from "./SignUp";
import { SignupUserDataProvider } from "../../../context/context";
import PersonalInfo from "./PersonalInfo";
import CustomButton from "../../../components/Button/Button";

const Main = () => {
  const [showPersonal, setShowPersonal] = useState(false);

  const handleShowPersonal = () => {
    setShowPersonal((prevState) => !prevState);
  };
  return (
    <SignupUserDataProvider>
      <div className="wrapperSignup max-w-[400px] mx-auto">
        <div className="wrapperWelcome ">
          <div className="welcomeBox py-10 px-4  ">
            <h2 className="text-customButton text-4xl font-medium pl-2">
              <span className="helloo mr-3">👋</span>Welcome !!
            </h2>
            <p className="text-gray-500 pt-2 ">
              Jymo welcomes you to our platform
            </p>
          </div>
        </div>
        <hr className=" -translate-y-3 max-w-[200px] mx-auto" />
        <div>
          {!showPersonal ? (
            <SignUp onShowPersonal={handleShowPersonal} />
          ) : (
            // Include the PersonalInfo component here
            <PersonalInfo />
          )}
        </div>
      </div>
    </SignupUserDataProvider>
  );
};

export default Main;
