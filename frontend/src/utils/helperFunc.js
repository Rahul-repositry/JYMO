// Function to store an object in localStorage
export const setObjectInLocalStorage = (key, value) => {
  try {
    const stringValue = JSON.stringify(value);
    localStorage.setItem(key, stringValue);
  } catch (error) {
    console.error("Error saving to localStorage", error);
  }
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
