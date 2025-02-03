const CheckInSummary = require("../models/checkInSummary.model");
const Membership = require("../models/membership.model");
const CustomError = require("./CustomError.utils");
const { ObjectId } = require("mongoose").Types;
const mongoose = require("mongoose");
const { addMinutes, startOfDay, startOfWeek, isSameDay } = require("date-fns");
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
    recoveryNumber,
  } = jym;

  return {
    _id, // Convert ObjectId to string
    name,
    jymUniqueId,
    addressLocation,
    owners,
    phoneNumbers,
    recoveryNumber,
    subscriptionFee,
  };
};

const updateLastCheckInForMembership = async (jymId, userId, status) => {
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
  if (status === "inactive") {
    let currentDate = new Date();
    let membershipEnds = new Date(latestMembership.endDate);
    if (currentDate.getTime() > membershipEnds.getTime()) {
      return "no membership to make inactive";
    }

    latestMembership.status.active.value = false; // Set to current date
  } else if (status === "active") {
    latestMembership.status.active.value = true; // Set to current date
  }
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
  currentDate.setHours(0, 0, 0, 0);

  // Calculate the start of the current week (Monday)
  const startOfWeek = new Date(currentDate);
  const dayOfWeek = startOfWeek.getDay();
  const diff = (dayOfWeek + 6) % 7; // Move back to Monday
  startOfWeek.setDate(currentDate.getDate() - diff);
  startOfWeek.setHours(0, 0, 0, 0);

  try {
    // Find the current week summary for the specific gym
    let summary = await CheckInSummary.findOne({
      jymId: jymId,
      startOfWeek: startOfWeek,
    });

    if (summary) {
      // Check if today's date exists in checkInArr
      const existingEntry = summary.checkInArr.find(
        (entry) => entry.date.getTime() === currentDate.getTime()
      );

      if (existingEntry) {
        // If today's entry exists, update the totalCheckIns
        existingEntry.totalCheckIns += checkInCount;
      } else {
        // If today's entry doesn't exist, push a new entry
        summary.checkInArr.push({
          date: currentDate,
          totalCheckIns: checkInCount,
        });
      }
    } else {
      // If no summary exists for the week, create a new one
      summary = new CheckInSummary({
        jymId: jymId,
        startOfWeek: startOfWeek,
        checkInArr: [
          {
            date: currentDate,
            totalCheckIns: checkInCount,
          },
        ],
      });
    }

    // Save or update the summary
    await summary.save();
    return summary;
  } catch (error) {
    console.error("Error updating or creating check-in summary:", error);
    throw error;
  }
};

// const updateOrCreateCheckInSummary = async (jymId, checkInCount = 1) => {
//   // IST offset in minutes (5 hours 30 minutes)
//   const IST_OFFSET_MINUTES = 5.5 * 60;

//   // Get the current date in UTC and shift to IST
//   const nowUTC = new Date();
//   const currentDate = startOfDay(addMinutes(nowUTC, IST_OFFSET_MINUTES)); // Start of day in IST

//   // Calculate the start of the current week (Monday) based on IST
//   const startOfWeekIST = startOfWeek(currentDate, { weekStartsOn: 1 }); // Week starts on Monday

//   try {
//     // Find the current week summary for the specific gym
//     let summary = await CheckInSummary.findOne({
//       jymId: jymId,
//       startOfWeek: startOfWeekIST,
//     });

//     if (summary) {
//       // Check if today's date exists in checkInArr
//       const existingEntry = summary.checkInArr.find((entry) =>
//         isSameDay(entry.date, currentDate)
//       );

//       if (existingEntry) {
//         // If today's entry exists, update the totalCheckIns
//         existingEntry.totalCheckIns += checkInCount;
//       } else {
//         // If today's entry doesn't exist, push a new entry
//         summary.checkInArr.push({
//           date: currentDate,
//           totalCheckIns: checkInCount,
//         });
//       }
//     } else {
//       // If no summary exists for the week, create a new one
//       summary = new CheckInSummary({
//         jymId: jymId,
//         startOfWeek: startOfWeekIST,
//         checkInArr: [
//           {
//             date: currentDate,
//             totalCheckIns: checkInCount,
//           },
//         ],
//       });
//     }

//     // Save or update the summary
//     await summary.save();
//     return summary;
//   } catch (error) {
//     console.error("Error updating or creating check-in summary:", error);
//     throw error;
//   }
// };

module.exports = {
  checkCooldown,
  formatTime,
  filterJymDetails,
  updateLastCheckInForMembership,
  updateOrCreateCheckInSummary,
  filterUserDetails,
};
