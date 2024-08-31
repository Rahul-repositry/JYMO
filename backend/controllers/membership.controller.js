const Membership = require("../models/membership.model.js");
const User = require("../models/user.model.js");
const CustomError = require("../utils/CustomError.utils.js");
const { AsyncErrorHandler } = require("../utils/AsyncErrorHandler.utils.js");
const { Jym } = require("../models/jym.model.js");
const Attendance = require("../models/attendance.model.js");
const { UserDurationInJym } = require("../models/userDuration.model.js");

const renewMembership = AsyncErrorHandler(async (req, res, next) => {
  let {
    userUniqueId,
    userId,
    amount,
    month = 1, // Default to 1 month if not provided
    totalAttendedDays = 0, // attendance days that are marked as registered after last membership
    extraDays = 0, // extra days will be like days after 6 days of holidays and if someone is paying fee of next month before ending those remaing days will also be considered as extra days
  } = req.body;
  const jymId = req.jym._id;

  // Find user by userId or userUniqueId
  const user = userId
    ? await User.findById({ _id: userId })
    : await User.findOne({ userUniqueId });

  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  // Check if user has an active membership in the gym
  const latestMembership = await Membership.findOne({
    userId: user._id,
    jymId,
  }).sort({ createdAt: -1 });

  console.log({ latestMembership, user });

  if (!latestMembership) {
    return next(new CustomError("No active membership found to renew", 404));
  }

  // Calculate the new end date for the renewed membership
  const currentDate = new Date();
  let baseDays = month * 30; // Total days based on the number of months
  let adjustedDays = baseDays + extraDays - totalAttendedDays;
  let newEndDate = new Date(
    latestMembership.endDate.getTime() + adjustedDays * 24 * 60 * 60 * 1000
  );

  // Determine if this renewal is for a previous period
  let isPreviousMembership = newEndDate.getTime() < currentDate.getTime();

  // Update the existing membership with the new end date and amount

  const newMembership = new Membership({
    jymId,
    userId: user._id,
    userUniqueId: user.userUniqueId,
    amount,
    isPreviousMembership,
    startDate: currentDate,
    endDate: newEndDate,
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
    ? await User.findById(userId)
    : await User.findOne({ userUniqueId });

  if (!userData) {
    return next(new CustomError("User not found", 404));
  }

  // Update the user's currentJymUUId
  userData.currentJymUUId.push({ jymId, name: req.jym.name });
  await userData.save();

  // Check for existing membership
  const latestMembership = await Membership.findOne({
    jymId,
    userId: userData._id,
  })
    .sort({ createdAt: -1 })
    .exec();

  if (latestMembership) {
    return next(new CustomError("Membership already exists", 409));
  }

  // Calculate end date and membership status
  const baseDays = month * 30;
  const adjustedDays = baseDays + extraDays - totalExtraAttendedDays;
  const endDate = new Date(
    currentDate.getTime() + adjustedDays * 24 * 60 * 60 * 1000
  );
  const isPreviousMembership = endDate.getTime() < currentDate.getTime();

  // Create new membership
  const newMembership = new Membership({
    jymId,
    userId: userData._id,
    userUniqueId: userData.userUniqueId,
    amount,
    isPreviousMembership,
    endDate,
  });

  const savedMembership = await newMembership.save();

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
      joinDates: [currentDate.toISOString()],
      isBecomeActiveUser: true,
    });
  } else if (userDuration.isTrialUser) {
    userDuration.isTrialUser = false;
    userDuration.isBecomeActiveUser = true;
    userDuration.joinDates.push(currentDate.toISOString());
  }

  await userDuration.save();

  res.status(201).json({
    success: true,
    message: "Membership created successfully",
    data: savedMembership,
  });
});

const isMember = AsyncErrorHandler(async (req, res, next) => {
  const _id = req.params.id;
  const jymId = req.jym._id;
  let newMember = true;
  // Check if user exists
  const user = await User.findById({ _id });

  if (!user) {
    return next(new CustomError("User not found", 404));
  }
  const wasMember = await Membership.findOne({ jymId, userId: _id });

  if (!wasMember) {
    return res.status(200).json({
      success: true,
      newMember,
      user,
    });
  } else {
    return res.status(200).json({
      success: true,
      newMember: false,
      user,
    });
  }
});

const markTrialAttendance = AsyncErrorHandler(async (req, res, next) => {
  const jymId = req.jym._id;
  const { userId } = req.body;
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

  return res.status(200).json({
    success: true,
    message: "User Attendance is marked as trial user ",
    user: attendanceObj,
  });
});

const getMembership = AsyncErrorHandler(async (req, res, next) => {
  const jymId = req.params.jymid;
  const userId = req.user._id;
  const membership = await Membership.findOne({
    jymId: jymId,
    userId: userId,
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

/**
 * create function for quit ing user update userduration  quit date and quit stauts and mark inactive attendance update membership status
 */

//need to make a membership handler which changes data of existing membership like enddate , fee , this could be changed .
/**
 * 
 * will be used agaiin if there will be need for pause and resume membership 
 
const membershipResumeHandler = AsyncErrorHandler(async (req, res, next) => {
  const { userId } = req.body;

  // Fetch membership
  const membership = await Membership.findOne(userId).sort({
    createdAt: -1,
  });
  if (!membership) {
    return next(new CustomError("Membership not found", 404));
  }

  // Check if end date has passed
  if (new Date() > new Date(membership.endDate)) {
    return next(new CustomError("Membership has already expired", 400));
  }

  // Resume membership
  membership.resume();
  await membership.save();

  res.status(200).json({
    success: true,
    message: "Membership resumed successfully",
    membership: membership,
  });
});

const membershipPauseHandler = AsyncErrorHandler(async (req, res, next) => {
  const { userId } = req.body;

  // Fetch membership
  const membership = await Membership.findOne(userId).sort({
    createdAt: -1,
  });
  if (!membership) {
    return next(new CustomError("Membership not found", 404));
  }

  // Check if end date has passed
  if (new Date() > new Date(membership.endDate)) {
    return next(new CustomError("Membership has already expired", 400));
  }

  // Pause membership
  membership.pause();
  await membership.save();

  res.status(200).json({
    success: true,
    message: "Membership paused successfully",
    membership: membership,
  });
});
* 
 */
module.exports = {
  createMembership,
  isMember,
  markTrialAttendance,
  getMembership,
  renewMembership,
};
