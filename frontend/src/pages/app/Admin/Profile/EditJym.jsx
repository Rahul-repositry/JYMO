import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../../components/Button/Button";
import PhoneInput from "../../User/SignIn/components/PhoneInput";
// import LocationSelect from "./components/LocationSelect.jsx";
import PhoneNumberInput from "../Auth/components/PhoneNumberInput";
import LocationSelect from "../Auth/components/LocationSelect";
import { setObjectInLocalStorage } from "../../../../utils/helperFunc";
// import PhoneNumberInput from "./components/PhoneNumberInput.jsx";

const EditJym = ({ jymId }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    recoveryNumber: "",
    addressLocation: {
      country: "",
      state: "",
      city: "",
      address: "",
      zipCode: "",
    },
    phoneNumbers: [""],
  });
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    const fetchJymDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URI}/api/jym/gymdetails`,
          { withCredentials: true }
        );
        if (response.data.success) {
          // Use a spread operator to ensure all fields are populated
          setFormData({
            name: response.data.jymData.name || "",
            recoveryNumber: response.data.jymData.recoveryNumber || "",
            addressLocation: {
              ...formData.addressLocation,
              ...response.data.jymData.addressLocation,
            },
            phoneNumbers: response.data.jymData.phoneNumbers || [""],
          });
        }
      } catch (error) {
        console.error("Error fetching gym details:", error);
        toast.error("Failed to fetch gym details.");
      }
    };

    fetchJymDetails();
  }, [jymId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.recoveryNumber || phoneError) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URI}/api/jym/editgymdetails`,
        { ...formData },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Gym details updated successfully!");
        setObjectInLocalStorage("adminJym", response.data.data);
        navigate("/admin/home");
      } else {
        toast.error("Failed to update gym details.");
      }
    } catch (error) {
      console.error("Error updating gym details:", error);
      toast.error("Failed to update gym details.");
    }
  };
  return (
    <div className="flex flex-col px-6">
      <div className="text-customButton text-3xl my-5 font-medium text-center">
        Edit Gym Details
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Gym Name:
          </label>
          <input
            type="text"
            id="name"
            className="input-field"
            placeholder="Gym Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <LocationSelect
          addressLocation={formData.addressLocation}
          setFormData={setFormData}
        />

        <PhoneNumberInput
          phoneNumbers={formData.phoneNumbers}
          setFormData={setFormData}
        />

        <div>
          <label
            htmlFor="recoveryNumber"
            className="block mb-2 text-gray-900 font-semibold text-xl text-center"
          >
            Account Recovery Number:
          </label>
          <PhoneInput
            phoneNumber={formData.recoveryNumber}
            validatePhoneNumber={(e) => {
              const phoneNumber = e.target.value;
              const phonePattern = /^[6789]\d{9}$/;

              setFormData((prev) => ({
                ...prev,
                recoveryNumber: phoneNumber,
              }));

              if (phonePattern.test(phoneNumber)) {
                setPhoneError("");
              } else {
                setPhoneError(
                  "Please enter a valid 10 digit Indian phone number."
                );
              }
            }}
            phoneError={phoneError}
          />
        </div>

        <CustomButton type="submit" fullWidth className="btn-primary">
          Update Gym Details
        </CustomButton>
      </form>
    </div>
  );
};

export default EditJym;
