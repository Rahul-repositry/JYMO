import React from "react";

const SelectJym = ({ options, selectedOption, setSelectedOption }) => {
  return (
    <div className="flex  items-center justify-center  py-4">
      <div className="mx-auto max-w-6xl px-12">
        <h2 className="py-3 font-medium">
          Select jym whose password you wanna change
        </h2>
        <div className="flex flex-wrap gap-3">
          {options.map((option) => (
            <label key={option.jymUniqueId} className="cursor-pointer  ">
              <input
                type="radio"
                className="peer sr-only"
                name="pricing"
                checked={selectedOption?.jymUniqueId === option.jymUniqueId}
                onChange={() => setSelectedOption(option)}
              />
              <div
                className={`w-72 max-w-xl rounded-md bg-white p-5 text-gray-600 ring-2 ring-transparent transition-all hover:shadow border border-gray-200 rounded 2xl ${
                  selectedOption?.jymUniqueId === option.jymUniqueId
                    ? "peer-checked:text-sky-600 peer-checked:ring-blue-400 peer-checked:ring-offset-2"
                    : ""
                }`}
              >
                <div className="flex justify-between gap-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase text-gray-500">
                      {option.name}
                    </p>
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-lg font-bold">{option.jymUniqueId}</p>
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectJym;
