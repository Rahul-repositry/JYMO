const Membership = require("../models/membership.model.js");
const User = require("../models/user.model.js");
const CustomError = require("../utils/CustomError.utils.js");
const { AsyncErrorHandler } = require("../utils/AsyncErrorHandler.utils.js");

const membershipHandler = AsyncErrorHandler(async (req, res, next) => {
  const { userId, amount, oneMonthFee } = req.body;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  // Create or renew membership
  const newMembership = await Membership.createOrRenewMembership(
    userId,
    amount,
    oneMonthFee
  );

  res.status(201).json({
    success: true,
    message: "Membership created or renewed successfully",
    membership: newMembership,
  });
});

const membershipResumeHandler = AsyncErrorHandler(async (req, res, next) => {
  const { membershipId } = req.body;

  // Fetch membership
  const membership = await Membership.findById(membershipId);
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
  const { membershipId } = req.body;

  // Fetch membership
  const membership = await Membership.findById(membershipId);
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

module.exports = {
  membershipHandler,
  membershipPauseHandler,
  membershipResumeHandler,
};
