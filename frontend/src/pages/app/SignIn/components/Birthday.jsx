import React, { useEffect, useState } from "react";
import "./birthday.css";
import { useSignupUserContext } from "../../../../context/context";

const BirthDate = () => {
  const [birthDate, setBirthDate] = useState({
    year: "",
    month: "",
    day: "",
  });

  const [signupData, updateSignupData] = useSignupUserContext();

  useEffect(() => {
    if (birthDate.year && birthDate.month && birthDate.day) {
      const formattedBirthday = `${birthDate.year}-${String(
        months.indexOf(birthDate.month) + 1
      ).padStart(2, "0")}-${String(birthDate.day).padStart(2, "0")}`;
      updateSignupData({ birthday: formattedBirthday });
    }
  }, [birthDate]);

  const handleDateChange = (e) => {
    const { id, value } = e.target;
    setBirthDate((prevDate) => ({
      ...prevDate,
      [id]: value,
    }));
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year);
    }
    return years;
  };

  const generateDays = (month, year) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = generateYears();
  const days =
    birthDate.month && birthDate.year
      ? generateDays(months.indexOf(birthDate.month) + 1, birthDate.year)
      : [];

  return (
    <div className="birthdate">
      <h2 className="block mb-2 text-sm font-medium text-gray-900">
        Birth Date :
      </h2>
      <div className="flex gap-4">
        <select
          required
          id="year"
          value={birthDate.year}
          onChange={handleDateChange}
          className="  select-field focus:ring-customButton focus:border-customButton"
        >
          <option value="" disabled>
            Year
          </option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select
          required
          id="month"
          value={birthDate.month}
          onChange={handleDateChange}
          className=" select-field focus:ring-customButton focus:border-customButton"
        >
          <option value="" disabled>
            Month
          </option>
          {months.map((month, index) => (
            <option key={index} value={month}>
              {month}
            </option>
          ))}
        </select>
        <select
          required
          id="day"
          value={birthDate.day}
          onChange={handleDateChange}
          className=" select-field focus:ring-customButton focus:border-customButton"
          disabled={!birthDate.month || !birthDate.year}
        >
          <option value="" disabled>
            Day
          </option>
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BirthDate;
