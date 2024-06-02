const CustomError = require("../utils/CustomError.utils.js");
const { AsyncErrorHandler } = require("../utils/AsyncErrorHandler.utils.js");
const Attendance = require("../models/attendance.model.js");
const { Jym } = require("../models/jym.model.js");
const User = require("../models/user.model.js");

// Function to update user's gym information
async function updateUserJymsdetail(userId, jymId) {
  const user = await User.findById(userId);

  if (user) {
    const currentDate = new Date();

    // Add gym to currentJymUUId if not already present
    if (!user.currentJymUUId.includes(jymId)) {
      user.currentJymUUId.push(jymId);
    }

    // Find or create gym entry in recentJyms
    const gymIndex = user.recentJyms.findIndex(
      (gym) => gym.jymId.toString() === jymId.toString()
    );

    if (gymIndex > -1) {
      // Gym already exists, push the join date
      user.recentJyms[gymIndex].joinDates.push(currentDate.toISOString());
    } else {
      // Create a new entry for the gym
      user.recentJyms.push({
        jymId: jymId,
        joinDates: [currentDate.toISOString()],
        quitDates: [],
      });
    }

    await user.save();
    console.log("User gyms updated successfully");
  } else {
    console.log("User not found");
  }
}

// Function to check if the user is in a trial period
async function isTrialPeriod(userId, jymId) {
  const attendanceRecord = await Attendance.findOne({
    userId: userId,
    jymId: jymId,
    mode: { $in: ["trial"] },
  }).sort({ createdAt: -1 });

  if (attendanceRecord) {
    const currentDate = new Date();
    const expiryDate = new Date(attendanceRecord.trialTokenExpiry);

    if (currentDate > expiryDate) {
      return "over";
    } else {
      return { status: "goingon", attendanceRecord };
    }
  }
  return false;
}

// Function to check if the user is registered
async function isRegistered(userId, jymId) {
  const attendanceRecord = await Attendance.findOne({
    userId: userId,
    jymId: jymId,
    mode: { $in: ["registered"] },
  }).sort({ createdAt: -1 });

  return !!attendanceRecord;
}

// Utility function to check if two dates are the same day
function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Function to mark attendance
async function markAttendance(
  userId,
  jymId,
  mode,
  trialTokenExpiry = null,
  isTrial = false
) {
  const newAttendance = new Attendance({
    userId: userId,
    jymId: jymId,
    mode: mode,
    isTrial: isTrial,
    trialTokenExpiry: trialTokenExpiry,
  });
  const attendanceObj = await newAttendance.save();
  attendanceObj.checkout = false;

  return attendanceObj;
}

// Function to update user's gym record
async function updateOwnerJym(userId, jymId) {
  const userJym = await Jym.findOne({ jymId });

  if (userJym) {
    const currentDate = new Date();
    const userIndex = userJym.activeUsers.findIndex(
      (user) => user.userId.toString() === userId.toString()
    );

    if (userIndex > -1) {
      userJym.activeUsers[userIndex].joinDates.push(currentDate.toISOString());
    } else {
      userJym.activeUsers.push({
        userId: userId,
        joinDates: [currentDate.toISOString()],
      });
    }

    await userJym.save();
    console.log("User updated successfully");
  }
}

//make attendance registratiton by admins

const attendanceHandler = AsyncErrorHandler(async (req, res, next) => {
  let { jymId, userId: userIdFromBody } = req.body;
  let userId = userIdFromBody || req.user._id;

  const today = new Date();
  let latestAttendance = await Attendance.findOne({ userId, jymId }).sort({
    createdAt: -1,
  });

  if (!latestAttendance) {
    // If no attendance record found, start trial
    const attendanceObj = await markAttendance(
      userId,
      jymId,
      "trial",
      null,
      true
    );
    return res.status(201).json({
      success: true,
      message: "Attendance marked as trial user",
      attendance: attendanceObj,
    });
  }

  if (latestAttendance.mode === "trial") {
    // Handle trial period attendance
    if (new Date() > new Date(latestAttendance.trialTokenExpiry)) {
      // Trial period is over, register user
      const attendanceObj = await markAttendance(userId, jymId, "registered");
      await updateOwnerJym(userId, jymId);
      await updateUserJymsdetail(userId, jymId);

      return res.status(201).json({
        success: true,
        message: "Trial period is over. Attendance marked as registered user.",
        attendance: attendanceObj,
      });
    } else {
      // Trial period is ongoing
      const createdAtDate = new Date(latestAttendance.createdAt);
      const isToday = createdAtDate.toDateString() === today.toDateString();

      if (!isToday) {
        const attendanceObj = await markAttendance(
          userId,
          jymId,
          "trial",
          latestAttendance.trialTokenExpiry
        );
        return res.status(200).json({
          success: true,
          message: "Trial period ongoing. Today's attendance marked.",
          attendance: attendanceObj,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Trial period ongoing.",
          attendance: latestAttendance,
        });
      }
    }
  } else if (latestAttendance.mode === "registered") {
    // Handle registered user attendance
    const createdAtDate = new Date(latestAttendance.createdAt);
    const isToday = createdAtDate.toDateString() === today.toDateString();

    if (!isToday) {
      const attendanceObj = await markAttendance(userId, jymId, "registered");
      return res.status(201).json({
        success: true,
        message: "Attendance marked for today as registered user.",
        attendance: attendanceObj,
      });
    } else {
      latestAttendance.checkOut = today.toISOString();
      await latestAttendance.save();

      return res.status(200).json({
        success: true,
        message: "Checkout time updated.",
        attendance: latestAttendance,
      });
    }
  }

  // If user is not registered, default response
  return res.status(200).json({
    success: false,
    message: "Quit Jym and Get-register again",
  });
});

//make membership handler for user

module.exports = { attendanceHandler };
