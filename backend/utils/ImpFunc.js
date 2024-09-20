const checkCooldown = (lastUpdated, cooldownMinutes = 2) => {
  const currentTime = new Date();
  const timeDifferenceInMinutes = Math.floor(
    (currentTime - new Date(lastUpdated)) / (1000 * 60)
  );
  return timeDifferenceInMinutes >= cooldownMinutes;
};

// Helper function to format time as "HH:MM"
const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
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

module.exports = { checkCooldown, formatTime, filterUserDetails };
