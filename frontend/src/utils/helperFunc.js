// Function to store an object in localStorage
export const setObjectInLocalStorage = (key, value) => {
  try {
    const stringValue = JSON.stringify(value);
    localStorage.setItem(key, stringValue);
  } catch (error) {
    console.error("Error saving to localStorage", error);
  }
};

// utils/getQueryParams.js
export const getQueryParams = (search) => {
  return new URLSearchParams(search);
};

// Function to retrieve an object from localStorage
export const getObjectFromLocalStorage = (key) => {
  try {
    const stringValue = localStorage.getItem(key);
    if (stringValue) {
      return JSON.parse(stringValue);
    }
    return null;
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return null;
  }
};

export const capitalizeFLetter = (text) => {
  if (!text) {
    return undefined;
  }

  let data = text[0].toUpperCase() + text.slice(1);

  return data ? data : "";
};

export const formatTime = (dateStr) => {
  let date = new Date(dateStr);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  // Determine AM/PM suffix
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12 || 12; // Convert 0 to 12 for midnight and 12-hour format
  hours = hours.toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds} ${ampm}`;
};
