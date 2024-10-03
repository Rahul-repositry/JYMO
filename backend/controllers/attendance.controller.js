const CustomError = require("../utils/CustomError.utils.js");
const { AsyncErrorHandler } = require("../utils/AsyncErrorHandler.utils.js");
const Attendance = require("../models/attendance.model.js");
const { Jym } = require("../models/jym.model.js");
const User = require("../models/user.model.js");
const { UserDurationInJym } = require("../models/userDuration.model.js");
const { ObjectId } = require("mongoose").Types;
const dotenv = require("dotenv");
dotenv.config();

/**
 there are many imperfection while trial and registering which will be solved when i will make frontend ready for it .
 1. like includes used as string but there is object in user and jym object .
 
 2. a new trial user property is added so when user quits chq trial user is there then make isActiveUser to false  .  vice versa if becomes activeuser.

 3. now for active user and quitted user location is chnaged and recent jym in user is also not more instead we use userdurationinjym for that . 
 */

// Function to update user's gym information

async function updateUserJymsdetail(userId, jymId) {
  const user = await User.findById(userId);

  if (user) {
    // Add gym to currentJymUUId if not already present
    if (!user.currentJymUUId.includes(jymId)) {
      user.currentJymUUId.push(jymId);
    }
    await user.save();
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
    checkOut: "",
    trialTokenExpiry: trialTokenExpiry,
  });
  const attendanceObj = await newAttendance.save();

  return attendanceObj;
}

// Function to update user's gym record
async function updateUserDurationForBecomingActiveUser(userId, jymId) {
  const userDuration = await UserDurationInJym.findOne({
    userId: new ObjectId(userId),
    jymId: new ObjectId(jymId),
  });
  const today = new Date();
  if (userDuration) {
    userDuration.isBecomeActiveUser = true;
    userDuration.joinDates.push(today.toISOString()); // updated first join Date  in user Duration
    await userDuration.save();
  }

  console.log("User updated successfully");
}

// Utility function to get the current date

/**
 * 
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
 */

const markTrialAttendance = async (jymId, userId) => {
  // Get the current date
  const currentDate = new Date();

  // Add 2 days to the current date
  const twoDaysLater = new Date(
    currentDate.getTime() + 2 * 24 * 60 * 60 * 1000
  );

  // Convert to ISO string if needed
  const isoDate = twoDaysLater.toISOString();

  // after creating trial attendance i want to store it in jym but that will get too messy there for we have to create new models of

  const newAttendance = new Attendance({
    userId: userId,
    jymId: jymId,
    mode: "trial",
    isTrial: true,
    trialTokenExpiry: isoDate,
    checkIn: currentDate.toISOString(),
  });

  const newUserDuration = new UserDurationInJym({
    userId: userId,
    jymId: jymId,
    isTrialUser: true,
    trialJoinDate: currentDate.toISOString(),
  });

  const userDurationObj = await newUserDuration.save();
  const attendanceObj = await newAttendance.save();

  return {
    success: true,
    message: "User Attendance is marked as trial user ",
    user: attendanceObj,
    userDuration: userDurationObj,
  };
};

const compareDates = (date1ISOString, date2ISOString) => {
  console.log({ date1ISOString }, { date2ISOString });
  const date1 = new Date(date1ISOString);
  const date2 = new Date(date2ISOString);

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() && // getMonth() returns month index (0 for Jan, 11 for Dec)
    date1.getDate() === date2.getDate() // getDate() returns day of the month
  );
};

const gapDays = (lastChqIn) => {
  let today = new Date();
  let lastChqInDate = new Date(lastChqIn);
  let timeDiff = Math.abs(today.getTime() - lastChqInDate.getTime());
  let oneDay = 1000 * 60 * 60 * 24;
  let gap = Math.round(timeDiff / oneDay);
  return gap;
};

//make attendance registratiton by admins
const attendanceHandler = AsyncErrorHandler(async (req, res, next) => {
  let { jymId, userId: userIdFromBody } = req.body;
  let userId = userIdFromBody || req.user._id; // if user mark attendance then no need for userid but if owner mark attendnace then send userid as userIdFromBody

  const today = new Date();
  let latestAttendance = await Attendance.findOne({ userId, jymId }).sort({
    createdAt: -1,
  });

  if (!latestAttendance) {
    return next(new CustomError("Get register with Jym first", 404));
  } else if (gapDays(latestAttendance.checkIn) >= process.env.REGISTERAGAININ) {
    return next(
      new CustomError(
        "Ask owner to register again you came after a long time",
        404
      )
    );
  } else if (latestAttendance.mode === "inactive") {
    return next(
      new CustomError(
        "Ask owner to register again you came after a long time",
        404
      )
    );
  } else if (latestAttendance.mode === "register") {
    let obj = await markTrialAttendance(jymId, userId);
    return res.status(200).json(obj);
  } else if (latestAttendance.mode === "trial") {
    // Handle trial period attendance
    if (new Date() > new Date(latestAttendance.trialTokenExpiry)) {
      // Trial period is over, register user
      const attendanceObj = await markAttendance(userId, jymId, "registered");
      await updateUserDurationForBecomingActiveUser(userId, jymId);
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
        latestAttendance.checkOut = today.toISOString();
        await latestAttendance.save();
        return res.status(200).json({
          success: true,
          message: "Trial period ongoing.",
          attendance: latestAttendance,
        });
      }
    }
  } else if (
    latestAttendance.mode === "registered" ||
    latestAttendance.mode === "registerAgain"
  ) {
    // Handle registered user attendance

    const isToday = compareDates(latestAttendance.checkIn, today.toISOString());

    if (!isToday) {
      const attendanceObj = await markAttendance(userId, jymId, "registered");
      return res.status(201).json({
        success: true,
        message: "Attendance marked successfully.",
        attendance: attendanceObj,
      });
    } else if (isToday && !latestAttendance.checkOut) {
      latestAttendance.checkOut = today.toISOString();
      await latestAttendance.save();
      return res.status(200).json({
        success: true,
        message: "Checkout time updated.",
        attendance: latestAttendance,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Today's attendance has been marked. .",
        attendance: latestAttendance,
      });
    }
  }

  // If user is not registered, default response
  return next(new CustomError("Get register again in Jym", 500));
});

const getAttendanceByDate = AsyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const jymId = req.body.jymId;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const attendance = await Attendance.find({
    userId: new ObjectId(userId),
    jymId: new ObjectId(jymId),
    checkIn: { $gte: startDate, $lte: endDate },
  });
  console.log(attendance, startDate, endDate);
  if (attendance.length > 0) {
    return res.status(200).json({
      success: true,
      message: "Attendance found",
      attendance: attendance,
    });
  }

  return next(new CustomError("No attendance found for this member", 404));
});

const registerAttendance = AsyncErrorHandler(async (req, res, next) => {
  const { userId } = req.body;
  const { jymId } = req.jym._id;
  const attendance = await Attendance.findOne({ userId, jymId });
  if (attendance) {
    return next(new CustomError("Member already exists for this jym", 403));
  }
  const newAttendance = new Attendance({
    userId,
    jymId,
    mode: "register",
  });
  let att = await newAttendance.save();

  return res.status(200).json({
    success: true,
    message: "Attendance initiated",
    attendance: att,
  });
});

const registerAgainAttendance = AsyncErrorHandler(async (req, res, next) => {
  // update user duration quit dates if user is not making attendance for process.env. REGISTERAGAININ days or dont do it if user is inactive because in that case that will be already done

  const { userId } = req.body;
  const { jymId } = req.jym._id;
  const today = new Date();
  const attendance = await Attendance.findOne({
    userId: new ObjectId(userId),
    jymId: new ObjectId(jymId),
  }).sort({ createdAt: -1 });
  if (!attendance) {
    return next(new CustomError("Get register First ", 404));
  }

  const userDuration = await UserDurationInJym.findOne({
    userId: new ObjectId(userId),
    jymId: new ObjectId(jymId),
  });
  if (userDuration) {
    userDuration.quitDates.push(attendance.checkIn);
    userDuration.joinDates.push(today.toISOString());
    await userDuration.save();
  }

  const newAttendance = new Attendance({
    userId,
    jymId,
    mode: "registerAgain",
  });
  let att = await newAttendance.save();

  return res.status(200).json({
    success: true,
    message: "Now user can mark their Attendance",
    attendance: att,
  });
});

const inactiveAttendance = async (jymId, userId, userUniqueId) => {
  // while using this func if you have userId available then send it and make other userUniqueId = null and vice versa
  const userData = userId
    ? await User.findById(userId)
    : await User.findOne({ userUniqueId });

  const newAttendance = new Attendance({
    userId: userData._id,
    jymId: jymId,
    mode: "inactive",
  });
  let att = await newAttendance.save();

  return res.status(200).json({
    success: true,
    message: "Attendance initiated",
    attendance: att,
  });
};

module.exports = {
  inactiveAttendance,
  registerAgainAttendance,
  attendanceHandler,
  registerAttendance,
  getAttendanceByDate,
};

/**
 *
 *  wht can happen in regular attendance
 *
 * can be marked by scanning the jym qr
 *
 * jym id from qr will be get and user Id will be get
 *
 *
 *
 * can be marked by writing the jym unique id
 *
 * we will have jymUnique id and userid
 * - you have to make another function  that first get jym id by quering with jymUnique id
 * - now with jymid and userid make attendance as usual
 *
 *
 * can be marked by owner
 *
 * will search user with userUniqueid or with number(from there get userId) and jym id(will be present  with the help of redux state ) will get available
 * - must remember that make  input search with two option by defaullt it will be search by phone number  and other option will be showing searchwith uid . (when 10 number get completed only then query the search)
 *
 * we want to show only those user which are the member of that jym and are currently active .
 * - In backend first get jym bson and user bson and chq that is user present in jym by chqing  user attendance with jymid and user id  and attendance should not be inactive or  gap of today and this attendance chq in should not be greater that 30 days othere wise user have to registerAgain.
 *
 *
 * wht to remember in all of these 3
 *
 *
 *
 * only mark attendance if user is previous attendance mode is register for their respective jyms
 *
 * if attendance gap between today attendance and previous attendance is greater than 30 days or mode is inactive then user cant make attendance until registerAgain attendance is made
 *
 * if last attendance  status is initiated then make a trial of the user for 2 days
 *
 * if last is registeragin then make registered attendance
 *
 *
 *
 *
 *
 *
 */
