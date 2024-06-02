const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { Jym } = require("../models/jym.model");

dotenv.config("");

const verifyUser = (req, res, next) => {
  const token = req.cookies.access_token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: "Token is not valid" });
      } else {
        req.user = decoded.user;

        next();
      }
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "You are not authenticated",
    });
  }
};

const verifyJym = (req, res, next) => {
  const token = req.cookies.access_jymToken;
  console.log({ token });

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: "Token is not valid" });
      } else {
        req.jym = decoded.jym;

        next();
      }
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "You are not authenticated",
    });
  }
};

// verify is user registered to this jym whose attendance is gonna marked by owner  ( for attendance purpose only)

const verifyOwnershipAndActiveUser = async (req, res, next) => {
  const { userId } = req.body;
  const ownerId = req.user._id;
  const jymId = req.jym._id;

  try {
    const jym = await Jym.findById(jymId);

    if (!jym) {
      return res.status(404).json({ success: false, message: "Gym not found" });
    }

    // Check if the authenticated user is an owner of the gym
    if (!jym.owners.includes(ownerId)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to mark attendance for this gym",
      });
    }

    let latestAttendance = await Attendance.findOne({ userId, jymId }).sort({
      createdAt: -1,
    });
    const isInTrialPeriod =
      latestAttendance &&
      new Date(latestAttendance.trialTokenExpiry) >= new Date();

    // Check if the user whose attendance is being marked is an active user of the gym
    const isActiveUser = jym.activeUsers.some(
      (user) => user.userId.toString() === userId
    );

    // Logic to allow attendance marking for users in trial period or active users
    if (isInTrialPeriod) {
      return next();
    }

    if (isActiveUser) {
      return next();
    }
    return res.status(400).json({
      success: false,
      message:
        "User is not an active member or in trial period. Ask the user to register themselves.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = verifyOwnershipAndActiveUser;

module.exports = { verifyUser, verifyJym };
