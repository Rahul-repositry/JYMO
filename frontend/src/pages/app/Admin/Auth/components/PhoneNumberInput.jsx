import React from "react";
import CustomButton from "../../../../../components/Button/Button";
import { toast } from "react-toastify";

const PhoneNumberInput = ({ phoneNumbers, setFormData }) => {
  const handlePhoneNumberChange = (index, value) => {
    const newPhoneNumbers = [...phoneNumbers];
    newPhoneNumbers[index] = value;
    setFormData((prev) => ({
      ...prev,
      phoneNumbers: newPhoneNumbers,
    }));
  };

  const addPhoneNumberField = () => {
    if (phoneNumbers.length < 4) {
      setFormData((prev) => ({
        ...prev,
        phoneNumbers: [...prev.phoneNumbers, ""],
      }));
    } else {
      toast.error("You can only add up to 4 phone numbers.");
    }
  };

  const deletePhoneNumberField = (index) => {
    if (phoneNumbers.length > 1) {
      const newPhoneNumbers = phoneNumbers.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        phoneNumbers: newPhoneNumbers,
      }));
    } else {
      toast.error("At least one phone number is required.");
    }
  };

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900">
        Phone Numbers:
      </label>
      {phoneNumbers.map((number, index) => (
        <div key={index} className="flex gap-3 items-center">
          <input
            type="text"
            className="input-field"
            placeholder="Phone Number"
            value={number}
            onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
          />
          <button
            type="button"
            className="bg-customButton rounded-lg p-2 mb-6"
            onClick={() => deletePhoneNumberField(index)}
            style={{
              display: index === 0 ? "none" : "block",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#fff"
              className="bi bi-trash"
              viewBox="0 0 16 16"
            >
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
            </svg>
          </button>
        </div>
      ))}

      <CustomButton type="button" fullWidth onClick={addPhoneNumberField}>
        Add Phone Number
      </CustomButton>
    </div>
  );
};

export default PhoneNumberInput;
