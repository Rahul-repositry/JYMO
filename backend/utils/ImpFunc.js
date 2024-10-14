const checkCooldown = (lastUpdated, cooldownMinutes = 2) => {
  const currentTime = new Date();
  const timeDifferenceInMinutes = Math.floor(
    (currentTime - new Date(lastUpdated)) / (1000 * 60)
  );
  return timeDifferenceInMinutes >= cooldownMinutes;
};

// Helper function to format time as "HH:MM"
const formatTime = (date) => {
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

// utils/filterUserDetails.js
const filterUserDetails = (user) => {
  if (!user) return null;

  const {
    username,
    _id,
    email,
    gender,
    img,
    phone,
    birthday,
    createdAt,
    updatedAt,
    role,
    userUniqueId,
    isOwner,
  } = user;

  return {
    username,
    _id,
    email,
    gender,
    img,
    phone,
    birthday,
    createdAt,
    updatedAt,
    role,
    userUniqueId,
    isOwner,
  };
};

const filterJymDetails = (jym) => {
  if (!jym) return null;
  const {
    _id,
    name,
    jymUniqueId,
    addressLocation,
    owners,
    phoneNumbers,
    subscriptionFee,
  } = jym;

  return {
    _id,
    name,
    jymUniqueId,
    addressLocation,
    owners,
    phoneNumbers,
    subscriptionFee,
  };
};

module.exports = {
  checkCooldown,
  formatTime,
  filterJymDetails,
  filterUserDetails,
};
