const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { Jym } = require("../models/jym.model");
const User = require("../models/user.model");
const CustomError = require("./CustomError.utils");
const { filterUserDetails } = require("./ImpFunc");
const { ObjectId } = require("mongoose").Types;

dotenv.config("");

const verifyUser = async (req, res, next) => {
  // if in future you update user model update here in req.user to add new properties
  const token = req.cookies.access_token;
  console.log(token, "token for user");
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.log(err);
        return res
          .status(401)
          .json({ success: false, message: "Token is not valid" });
      } else {
        const user = await User.findById({ _id: decoded.user._id });
        console.log(user, "user in verify");
        if (!user) {
          return next(new CustomError("No User found", 404));
        }
        // Use filterUserDetails utility to standardize user object
        req.user = filterUserDetails(user);
        next();
      }
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Complete Your Login Authentication",
    });
  }
};

// const verifyUser = async (req, res, next) => {
//   // If in the future you update the user model, update req.user here to add new properties
//   const token = req.cookies.access_token;

//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: "You are not authenticated",
//     });
//   }

//   try {
//     // Verify the JWT token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Find the user by ID asynchronously
//     const user = await User.findById({ _id: decoded.user._id });

//     if (!user) {
//       return next(new CustomError("No User found", 404));
//     }

//     // Destructure user fields to attach to the request
//     const {
//       username,
//       _id,
//       email,
//       gender,
//       img,
//       phone,
//       birthday,
//       createdAt,
//       updatedAt,
//       role,
//       userUniqueId,
//       isOwner,
//     } = user;

//     // Attach user data to the req object
//     req.user = {
//       username,
//       _id,
//       email,
//       gender,
//       img,
//       phone,
//       birthday,
//       createdAt,
//       updatedAt,
//       role,
//       userUniqueId,
//       isOwner,
//     };

//     console.log(req.user, "jwt user");

//     // Proceed to the next middleware
//     next();
//   } catch (err) {
//     // Handle any errors (token verification or user lookup)
//     return res.status(401).json({
//       success: false,
//       message: "Token is not valid or user not found",
//       error: err.message,
//     });
//   }
// };

const verifyJym = (req, res, next) => {
  const token = req.cookies.access_jymToken;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: "Token is not valid" });
      } else {
        console.log(decoded);
        let decodedObj = {
          _id: decoded.id,
          ...decoded,
        };

        req.jym = decodedObj;

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

const verifyOwnership = async (req, res, next) => {
  const ownerId = req.user._id;

  const jymId = req.jym._id;

  try {
    const jym = await Jym.findById({ _id: new ObjectId(jymId) });

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

    next(); // Call next() on successful ownership verification
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const verifyActiveUser = async (req, res, next) => {
  const userId = req.body.userId;
  const jymId = req.jym._id;

  try {
    const latestAttendance = await Attendance.findOne({
      userId: new ObjectId(userId),
      jymId: new ObjectId(jymId),
    }).sort({
      createdAt: -1,
    });

    if (!latestAttendance) {
      return res.status(400).json({
        success: false,
        message: "Register user for this jym",
      });
    }

    // Logic to allow attendance marking for users in trial period or active users
    if (latestAttendance.mode != "inactive") {
      next(); // Call next() on successfull active user verification
    } else {
      return res.status(400).json({
        success: false,
        message: "User is not an active member",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const verifyJymoDietBackendUser = (req, res, next) => {
  const token = req.cookies.jymoDietBackendUser_token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: "Token is not valid" });
      } else {
        req.jymoDietBackendUser = decoded.jymoDietBackendUser;

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

// const verifyOwnershipAndActiveUser = async (req, res, next) => {
//   const { userId } = req.body;
//   const ownerId = req.user._id;
//   const jymId = req.jym._id;

//   try {
//     const jym = await Jym.findById(jymId);

//     if (!jym) {
//       return res.status(404).json({ success: false, message: "Gym not found" });
//     }

//     // Check if the authenticated user is an owner of the gym
//     if (!jym.owners.includes(ownerId)) {
//       return res.status(403).json({
//         success: false,
//         message: "Not authorized to mark attendance for this gym",
//       });
//     }

//     let latestAttendance = await Attendance.findOne({ userId, jymId }).sort({
//       createdAt: -1,
//     });
//     const isInTrialPeriod =
//       latestAttendance &&
//       new Date(latestAttendance.trialTokenExpiry) >= new Date();

//     // Check if the user whose attendance is being marked is an active user of the gym
//     const isActiveUser = jym.activeUsers.some(
//       (user) => user.userId.toString() === userId
//     );

//     // Logic to allow attendance marking for users in trial period or active users
//     if (isInTrialPeriod) {
//       return next();
//     }

//     if (isActiveUser) {
//       return next();
//     }
//     return res.status(400).json({
//       success: false,
//       message:
//         "User is not an active member or in trial period. Ask the user to register themselves.",
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

module.exports = {
  verifyUser,
  verifyJym,
  verifyOwnership,
  verifyActiveUser,
  verifyJymoDietBackendUser,
};
