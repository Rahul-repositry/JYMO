const Membership = require("../models/membership.model.js");
const User = require("../models/user.model.js");
const CustomError = require("../utils/CustomError.utils.js");
const { AsyncErrorHandler } = require("../utils/AsyncErrorHandler.utils.js");
const { UserDurationInJym } = require("../models/userDuration.model.js");
const { filterUserDetails } = require("../utils/ImpFunc.js");
const { ObjectId } = require("mongoose").Types;
const dotenv = require("dotenv");

dotenv.config();

const renewMembership = AsyncErrorHandler(async (req, res, next) => {
  let {
    userUniqueId,
    userId,
    amount,
    startDate,
    month = 1, // Default to 1 month if not provided
    // totalAttendedDays = 0, // attendance days that are marked as registered after last membership
    // extraDays = 0, // extra days will be like days after 6 days of holidays and if someone is paying fee of next month before ending those remaing days will also be considered as extra days
  } = req.body;
  const jymId = req.jym._id;
  const newStartDate = new Date(startDate);
  // Find user by userId or userUniqueId
  const user = userId
    ? await User.findById({ _id: new ObjectId(userId) })
    : await User.findOne({ userUniqueId });

  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  // Check if user has an active membership in the gym
  const latestMembership = await Membership.findOne({
    userId: new ObjectId(user._id),
    jymId: new ObjectId(jymId),
  }).sort({ createdAt: -1 });

  if (!latestMembership) {
    return next(new CustomError("Create Membership First to renew it .", 404));
  }

  // Calculate the new end date for the renewed membership
  let baseDays = month * 30; // Total days based on the number of months
  // let adjustedDays = baseDays + extraDays - totalAttendedDays;
  let newEndDate = new Date(
    newStartDate.getTime() + baseDays * 24 * 60 * 60 * 1000
  );
  console.log({ baseDays, newEndDate, newStartDate });
  // Update the existing membership with the new end date and amount

  const newMembership = new Membership({
    jymId,
    userId: user._id,
    userUniqueId: user.userUniqueId,
    amount,
    startDate: newStartDate,
    endDate: newEndDate,
    userDuration: latestMembership.userDuration,
  });

  const savedMembership = await newMembership.save();

  res.status(200).json({
    success: true,
    message: `Membership renewed up to ${newEndDate.getDate()}/${
      newEndDate.getMonth() + 1
    }/${newEndDate.getFullYear()} successfully`,
    data: savedMembership,
  });
});

const createMembership = AsyncErrorHandler(async (req, res, next) => {
  /**
   * on load  of create membership on owner dashboard after scanning all the data will be fetched like 
        - userDuration will be fetched to get  latest(important) trialjoinDate
        - a query to dataase is made for all attendance after that date
        - if user had come then it will show calendar to quickly mark all days by owner
        - an algorithm will be run to mark all attendance automatically .  
  
   */

  let {
    userUniqueId,
    amount,
    month = 1,
    totalExtraAttendedDays = 0,
    extraDays = 0,
    userId,
  } = req.body;

  const jymId = req.jym._id;
  const currentDate = new Date();

  // Find user data
  const userData = userId
    ? await User.findById({ userId: new ObjectId(userId) })
    : await User.findOne({ userUniqueId });

  if (!userData) {
    return next(new CustomError("User not found", 404));
  }

  // Check if this gym is already in currentJymUUId array
  const isGymAlreadyAdded =
    Array.isArray(userData.currentJymUUId) &&
    userData.currentJymUUId.some(
      (gym) => gym?.jymId && gym.jymId.toString() === jymId.toString()
    );

  // Only add the gym if it's not already present
  if (!isGymAlreadyAdded) {
    userData.currentJymUUId.push({ jymId, name: req.jym.name });
    await userData.save();
  }

  // Check for existing membership
  const latestMembership = await Membership.findOne({
    jymId: new ObjectId(jymId),
    userId: new ObjectId(userData._id),
  })
    .sort({ createdAt: -1 })
    .exec();

  if (latestMembership) {
    return next(new CustomError("Membership already exists", 409));
  }

  // Update or create user duration
  /**
   *   user can direct create membership or userduration can be created after trial period
   *
   */
  let userDuration = await UserDurationInJym.findOne({
    userId: userData._id,
    jymId,
  });

  if (!userDuration) {
    userDuration = new UserDurationInJym({
      userId: userData._id,
      jymId,
      joinDates: [currentDate],
      isBecomeActiveUser: true,
    });
    await userDuration.save();
  }

  // Calculate end date and membership status
  const baseDays = month * 30;
  const adjustedDays = baseDays + extraDays - totalExtraAttendedDays;
  const endDate = new Date(
    currentDate.getTime() + adjustedDays * 24 * 60 * 60 * 1000
  );

  // Create new membership

  const newMembership = new Membership({
    jymId,
    userId: userData._id,
    userUniqueId: userData.userUniqueId,
    amount,
    endDate,
    userDuration: userDuration._id,
  });

  const savedMembership = await newMembership.save();
  res.status(201).json({
    success: true,
    message: "Membership created successfully",
    data: savedMembership,
  });
});

const memberStatus = AsyncErrorHandler(async (req, res, next) => {
  const { userId, userUniqueId } = req.query; // Use req.query for URL parameters
  const jymId = req.jym._id;
  console.log("is this working ");
  let status = {
    "In-active": false, // if true means user is inactive
    Register: false,
    "Register-Again": false,
    Renew: false,
  };

  // Ensure at least one identifier is provided
  if (!userId && !userUniqueId) {
    return next(
      new CustomError("User ID or User Unique ID must be provided", 400)
    );
  }

  // Check if user exists
  const user = userId
    ? await User.findById({ _id: new ObjectId(userId) })
    : await User.findOne({ userUniqueId });

  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  // Find the latest membership record for the user in this gym
  const membership = await Membership.findOne({
    jymId: new ObjectId(jymId),
    userId: new ObjectId(user._id),
  }).sort({ createdAt: -1 });

  if (!membership) {
    return res.status(200).json({
      success: true,
      message: "You must create a membership first.",
      status: { ...status, Register: true },
      user: filterUserDetails(user),
    });
  }

  const lastCheckIn = membership?.status?.active?.lastCheckIn;
  if (!lastCheckIn) {
    return next(new CustomError("Invalid membership data", 500));
  }

  const lastCheckInDate = new Date(lastCheckIn);
  const currentDate = new Date();
  const FIFTEEN_DAYS = process.env.INACTIVE_IN_DAYS * 24 * 60 * 60 * 1000;
  const timeSinceLastCheckIn = currentDate - lastCheckInDate;

  // User attended within the last 15 days, so renew
  if (timeSinceLastCheckIn <= FIFTEEN_DAYS) {
    return res.status(200).json({
      success: true,
      message: "You can renew membership.",
      status: { ...status, Renew: true },
      user: filterUserDetails(user),
    });
  }

  // User has not attended in over 15 days, require re-registration
  return res.status(200).json({
    success: true,
    message: "You must register again for membership.",
    status: { ...status, "Register-Again": true },
    user: filterUserDetails(user),
  });
});

// const markTrialAttendance = AsyncErrorHandler(async (req, res, next) => {
//   const jymId = req.jym._id;
//   const { userId } = req.body;
//   // Get the current date
//   const currentDate = new Date();

//   // Add 2 days to the current date
//   const twoDaysLater = new Date(
//     currentDate.getTime() + 2 * 24 * 60 * 60 * 1000
//   );

//   // Convert to ISO string if needed
//   const isoDate = twoDaysLater.toISOString();

//   // after creating trial attendance i want to store it in jym but that will get too messy there for we have to create new models of

//   const newAttendance = new Attendance({
//     userId: userId,
//     jymId: jymId,
//     mode: "trial",
//     isTrial: true,
//     trialTokenExpiry: isoDate,
//     checkIn: currentDate.toISOString(),
//   });

//   const newUserDuration = new UserDurationInJym({
//     userId: userId,
//     jymId: jymId,
//     isTrialUser: true,
//     trialJoinDate: currentDate.toISOString(),
//   });

//   const userDurationObj = await newUserDuration.save();
//   const attendanceObj = await newAttendance.save();

//   return res.status(200).json({
//     success: true,
//     message: "User Attendance is marked as trial user ",
//     user: attendanceObj,
//   });
// });

const getMembership = AsyncErrorHandler(async (req, res, next) => {
  const jymId = req.params.jymid;
  const userId = req.user._id;
  console.log({ jymId, userId });
  const membership = await Membership.findOne({
    jymId: new ObjectId(jymId),
    userId: new ObjectId(userId),
  }).sort({ createdAt: -1 });
  if (!membership) {
    return next(new CustomError("Create Membership with this jym", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Membership found",
    membership: membership,
  });
});

const getMembershipByUserId = AsyncErrorHandler(async (req, res, next) => {
  const jymId = req.jym._id;
  const userId = req.params.userId;
  console.log({ jymId, userId });
  const membership = await Membership.findOne({
    jymId: new ObjectId(jymId),
    userId: new ObjectId(userId),
  }).sort({ createdAt: -1 });
  if (!membership) {
    return next(new CustomError("Create Membership with this jym", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Membership found",
    membership: membership,
  });
});

const getAllMembership = AsyncErrorHandler(async (req, res, next) => {
  const userId = req.body.userId || req.user._id;
  const jymId = req.body.jymId || req.jym._id;
  const { skip = 0 } = req.query; // Default values for skip

  const memberships = await Membership.find({
    userId: new ObjectId(userId),
    jymId: new Object(jymId),
  })
    .skip(Number(skip)) // Skip the records based on the current page
    .limit(20) // Limit the number of records fetched per request
    .populate({
      path: "jymId",
      select: "name jymUniqueId addressLocation owners  phoneNumbers  ", // Select only these fields from the Jym model
    })
    .exec();

  console.log(memberships);
  if (!memberships.length) {
    return next(new CustomError("No more memberships found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Memberships fetched successfully",
    memberships: memberships,
  });
});

const updateInactiveMemberships = async () => {
  try {
    const FIFTEEN_DAYS_MS = process.env.MAXABSENTDAYS * 24 * 60 * 60 * 1000;
    const currentDate = new Date();

    // Aggregate pipeline to get the latest membership per userId and jymId, filter for inactivity, and update the status in one go
    const result = await Membership.aggregate([
      // Sort memberships by userId and endDate in descending order to get the latest memberships first
      { $sort: { userId: 1, endDate: -1 } },
      // Group by userId and jymId, keeping only the most recent membership
      {
        $group: {
          _id: { userId: "$userId", jymId: "$jymId" },
          mostRecentMembership: { $first: "$$ROOT" },
        },
      },
      // Replace the root document with the most recent membership data
      { $replaceRoot: { newRoot: "$mostRecentMembership" } },
      // Match memberships where the status is active and last check-in was over 15 days ago
      {
        $match: {
          "status.active.value": true,
          "status.active.lastCheckIn": {
            $lt: new Date(currentDate.getTime() - FIFTEEN_DAYS_MS),
          },
        },
      },
      // Update each matched document to set active.value to false
      {
        $set: { "status.active.value": false },
      },
      // Save the changes to the database
      {
        $merge: {
          into: "memberships", // replace with your actual collection name if different
          whenMatched: "merge",
          whenNotMatched: "discard",
        },
      },
    ]);

    console.log("Memberships updated for inactivity:", result);
  } catch (error) {
    console.error("Error updating memberships for inactivity:", error);
  }
};

module.exports = {
  createMembership,
  memberStatus,
  getAllMembership,
  // markTrialAttendance,
  getMembershipByUserId,
  updateInactiveMemberships,
  getMembership,
  renewMembership,
};
