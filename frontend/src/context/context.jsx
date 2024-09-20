import React, { createContext, useContext, useState } from "react";

import { toast } from "react-toastify";

const SignupUserDataContext = createContext(undefined);

/// only applicable for signup and personal info cannto used iin whole app

export function useSignupUserContext() {
  const context = useContext(SignupUserDataContext);

  if (context === undefined) {
    toast.error("Please fill signup data first.");
    throw new Error("useSignupUserContext is undefined right now");
  }

  return context;
}

export function SignupUserDataProvider({ children }) {
  const [signupData, setSignupData] = useState({
    username: "",
    img: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "",
    birthday: "",
    gender: "",
  });

  const updateSignupData = (newData) => {
    return new Promise((resolve) => {
      setSignupData((prevData) => {
        const updatedData = { ...prevData, ...newData };
        resolve(updatedData);
        return updatedData;
      });
    });
  };

  return (
    <SignupUserDataContext.Provider value={[signupData, updateSignupData]}>
      {children}
    </SignupUserDataContext.Provider>
  );
}
