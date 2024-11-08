import React from "react";
import Select from "react-select";
import { Country, State, City } from "country-state-city";

const LocationSelect = ({ addressLocation, setFormData }) => {
  const countryOptions = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));

  const stateOptions = addressLocation.country
    ? State.getStatesOfCountry(addressLocation.country).map((state) => ({
        value: state.isoCode,
        label: state.name,
      }))
    : [];

  const cityOptions = addressLocation.state
    ? City.getCitiesOfState(addressLocation.country, addressLocation.state).map(
        (city) => ({
          value: city.name,
          label: city.name,
        })
      )
    : [];

  const handleLocationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      addressLocation: {
        ...prev.addressLocation,
        [field]: value,
      },
    }));
  };

  return (
    <>
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Country:
        </label>
        <Select
          options={countryOptions}
          value={
            addressLocation.country
              ? countryOptions.find(
                  (option) => option.label === addressLocation.country
                )
              : null
          }
          onChange={(option) => handleLocationChange("country", option.value)}
          placeholder="Select Country"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          State:
        </label>
        <Select
          options={stateOptions}
          value={
            addressLocation.state
              ? stateOptions.find(
                  (option) => option.label === addressLocation.state
                )
              : null
          }
          onChange={(option) => handleLocationChange("state", option.value)}
          placeholder="Select State"
          isDisabled={!addressLocation.country}
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          City:
        </label>
        <Select
          options={cityOptions}
          value={
            addressLocation.city
              ? cityOptions.find(
                  (option) => option.label === addressLocation.city
                )
              : null
          }
          onChange={(option) => handleLocationChange("city", option.value)}
          placeholder="Select City"
          isDisabled={!addressLocation.state}
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="address"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Address:
        </label>
        <input
          type="text"
          id="address"
          className="input-field"
          placeholder="Full Address"
          required
          value={addressLocation.address}
          onChange={(e) => handleLocationChange("address", e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="zipCode"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Zip Code:
        </label>
        <input
          type="text"
          id="zipCode"
          className="input-field"
          placeholder="Zip Code"
          required
          value={addressLocation.zipCode}
          onChange={(e) => handleLocationChange("zipCode", e.target.value)}
        />
      </div>
    </>
  );
};

export default LocationSelect;
