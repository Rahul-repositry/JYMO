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

async function markAttendance(
  userId,
  jymId,
  mode,
  trialTokenExpiry = undefined,
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

// Utility function to get the current date
function getCurrentDate() {
  return new Date();
}

// Function to quit user from a gym
const quitUserHandler = AsyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { jymId } = req.params.jymId;

  // Find the gym by ID
  const jym = await Jym.findById(jymId);
  if (!jym) {
    return next(new CustomError("Gym not found", 404));
  }

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  // Get the current date
  const currentDate = getCurrentDate();

  // Remove user from activeUsers array and prepare to add to quittedUsers array
  let userFoundInActiveUsers = false;
  jym.activeUsers = jym.activeUsers.filter((activeUser) => {
    if (activeUser.userId.toString() === userId.toString()) {
      userFoundInActiveUsers = true;
      return false; // Filter out the user to remove from activeUsers
    }
    return true;
  });

  // Add user to quittedUsers array or update quitDates if already present
  let userFoundInQuittedUsers = false;
  jym.quittedUsers = jym.quittedUsers.map((quittedUser) => {
    if (quittedUser.userId.toString() === userId.toString()) {
      userFoundInQuittedUsers = true;
      quittedUser.quitDates.push(currentDate.toISOString());
    }
    return quittedUser;
  });

  if (!userFoundInQuittedUsers) {
    jym.quittedUsers.push({
      userId: userId,
      quitDates: [currentDate.toISOString()],
    });
  }

  if (!userFoundInActiveUsers) {
    return next(
      new CustomError("User is not currently an active user of the gym", 400)
    );
  }

  // Update the user's recentJyms array
  const gymIndex = user.recentJyms.findIndex(
    (gym) => gym.jymId.toString() === jymId.toString()
  );
  if (gymIndex > -1) {
    user.recentJyms[gymIndex].quitDates.push(currentDate.toISOString());
  }

  await jym.save();
  await user.save();

  res.status(200).json({
    success: true,
    message: "User has quit the gym and records updated successfully.",
  });
});

//make attendance registratiton by admins

const attendanceHandler = AsyncErrorHandler(async (req, res, next) => {
  const compareDates = (date1ISOString, date2ISOString) => {
    const [year1, month1, day1] = date1ISOString.split("T")[0].split("-");
    const [year2, month2, day2] = date2ISOString.split("T")[0].split("-");
    return year1 === year2 && month1 === month2 && day1 === day2;
  };

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
      const isToday = compareDates(
        latestAttendance.createdAt,
        today.toISOString()
      );

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
    const isToday = compareDates(
      latestAttendance.createdAt,
      today.toISOString()
    );

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
  return next(new CustomError("Quit Jym and Get-register again", 200));
});

module.exports = { attendanceHandler, quitUserHandler };
