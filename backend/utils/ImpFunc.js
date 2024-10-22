const CheckInSummary = require("../models/checkInSummary.model");
const Membership = require("../models/membership.model");
const CustomError = require("./CustomError.utils");
const { ObjectId } = require("mongoose").Types;

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

const updateLastCheckInForMembership = async (jymId, userId) => {
  // Fetch the latest membership
  const latestMembership = await Membership.findOne({
    jymId: new ObjectId(jymId),
    userId: new ObjectId(userId),
  }).sort({ createdAt: -1 });

  // If no membership is found, throw an error
  if (!latestMembership) {
    throw new CustomError("Membership not found", 404);
  }

  // Update the lastCheckIn date in the membership's status
  latestMembership.status.active.lastCheckIn = new Date(); // Set to current date

  // Save the updated membership
  await latestMembership.save();

  return latestMembership;
};

/**
 * Reusable function to update or create check-in summary for the specified gym (jymId) and date (startOfToday).
 * @param {mongoose.Types.ObjectId} jymId - The gym ID.
 * @param {Date} startOfToday - Start of today.
 * @param {Number} checkInCount - The check-ins to add for today.
 * @returns {Promise} - The updated or created CheckInSummary document.
 */
const updateOrCreateCheckInSummary = async (jymId, checkInCount = 1) => {
  const currentDate = new Date();

  // Calculate start of today
  const startOfToday = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  try {
    // Find the summary for the specific gym
    let summary = await CheckInSummary.findOne({
      jymId: mongoose.Types.ObjectId(jymId),
    });

    if (summary) {
      // Check if today's date exists in the checkInArr
      const existingEntry = summary.checkInArr.find(
        (entry) => entry.date.getTime() === startOfToday.getTime()
      );

      if (existingEntry) {
        // If today's entry exists, update the totalCheckIns
        existingEntry.totalCheckIns += checkInCount;
      } else {
        // If today's entry doesn't exist, push a new entry into checkInArr
        summary.checkInArr.push({
          date: startOfToday,
          totalCheckIns: checkInCount,
        });
      }
    } else {
      // If the summary doesn't exist, create a new one with today's entry
      summary = new CheckInSummary({
        jymId: mongoose.Types.ObjectId(jymId),
        checkInArr: [
          {
            date: startOfToday,
            totalCheckIns: checkInCount,
          },
        ],
      });
    }

    // Save or update the summary
    await summary.save();

    return summary; // Return the updated or created summary
  } catch (error) {
    console.error("Error updating or creating check-in summary:", error);
    throw error;
  }
};

module.exports = {
  checkCooldown,
  formatTime,
  filterJymDetails,
  updateLastCheckInForMembership,
  updateOrCreateCheckInSummary,
  filterUserDetails,
};
