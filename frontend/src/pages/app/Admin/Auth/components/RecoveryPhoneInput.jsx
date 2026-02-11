import React from "react";
import PhoneInput from "../../../User/SignIn/components/PhoneInput";

const RecoveryPhoneInput = ({
  phoneNumber,
  setPhoneNumber,
  validatePhoneNumber,
  phoneError,
}) => {
  return (
    <div>
      <label
        htmlFor="recoveryNumber"
        className="block mb-2 text-gray-900 font-semibold text-xl text-center"
      >
        Account Recovery Number:
      </label>
      <PhoneInput
        phoneNumber={phoneNumber}
        validatePhoneNumber={(e) => {
          const number = e.target.value;
          setPhoneNumber(number);
          validatePhoneNumber(number);
        }}
        phoneError={phoneError}
      />
    </div>
  );
};

export default RecoveryPhoneInput;
