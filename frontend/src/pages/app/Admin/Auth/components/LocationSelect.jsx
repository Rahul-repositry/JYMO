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
          onChange={(option) => handleLocationChange("city", option.value)}
          placeholder="Select City"
          isDisabled={!addressLocation.state}
        />
      </div>
    </>
  );
};

export default LocationSelect;
