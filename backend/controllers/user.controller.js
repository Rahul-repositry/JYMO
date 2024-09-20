const User = require("../models/user.model.js");
const { AsyncErrorHandler } = require("../utils/AsyncErrorHandler.utils.js");
const CustomError = require("../utils/CustomError.utils.js");
const { ObjectId } = require("mongoose").Types;
const admin = require("../config/firebase.js");
const Otp = require("../models/OTP.model.js");
const dotenv = require("dotenv");
const {
  checkCooldown,
  filterUserDetails,
  formatTime,
} = require("../utils/ImpFunc.js");

dotenv.config("");

// in frontend make  a request to user dataa on main parent page to persist new data of user
// in backend make a function to change data after 2 min of recently updation and

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const coolDownTimeInMin = process.env.COOL_DOWN_TIME_IN_MIN;

const userData = AsyncErrorHandler((req, res, next) => {
  console.log(req.user, "working now");

  // if in future you get a problem of getting old user update the properities in middleware.utils.js to get full data of updated user
  return res.status(200).json({ success: true, user: req.user });
});

const updateUserNameAndBdate = AsyncErrorHandler(async (req, res, next) => {
  const { name, birthday } = req.body;

  // Find the user by ID (assuming `req.user._id` contains the user ID)
  const user = await User.findById({ _id: new ObjectId(req.user._id) });

  if (!user) {
    return next(new CustomError("Register yourself", 404));
  }

  // Check if the last update was more than the cooldown period
  const lastUpdated = user.updatedAt;
  if (!checkCooldown(lastUpdated, coolDownTimeInMin)) {
    const lastUpdatedAtTime = new Date(lastUpdated);
    const canUpdateAt = new Date(
      lastUpdatedAtTime.getTime() + coolDownTimeInMin * 60 * 1000
    ); // Add cooldown time (2 minutes)
    return next(
      new CustomError(
        `You can only update your details after "${formatTime(canUpdateAt)}"`,
        403
      )
    );
  }

  // Update fields
  user.username = name || user.username;

  // Convert birthday to ISO string if it's not already in ISO format
  if (birthday) {
    const newBirthday = new Date(birthday);
    if (!isNaN(newBirthday.getTime())) {
      user.birthday = newBirthday.toISOString();
    } else {
      console.log(newBirthday, "new bdiday", birthday);
      return next(new CustomError("Invalid birthday format", 400));
    }
  }

  // Save the updated user data
  await user.save();

  return res.status(200).json({
    success: true,
    message: "User updated successfully",
    user: filterUserDetails(user),
  });
});

const updateUserEmail = AsyncErrorHandler(async (req, res, next) => {
  const { firebaseEmailIdToken } = req.body;

  // Build Firebase credential with the Google ID token.

  const firebaseUser = await admin.auth().verifyIdToken(firebaseEmailIdToken);

  if (!firebaseUser.email) {
    return next(new CustomError("Authentication failed", 401));
  }
  // Find the user by ID (assuming `req.user._id` contains the user ID)
  const user = await User.findById({ _id: new ObjectId(req.user._id) });

  if (!user) {
    return next(new CustomError("Register yourself", 404));
  }

  // Check if the last update was more than 2 minutes ago
  const lastUpdated = user.updatedAt;
  if (!checkCooldown(lastUpdated, coolDownTimeInMin)) {
    let lastUpdatedAtTime = new Date(lastUpdated);
    const canUpdateAt = new Date(
      lastUpdatedAtTime.getTime() + coolDownTimeInMin * 60 * 1000
    ); // Add 2 minutes to lastUpdated
    return next(
      new CustomError(
        `You can only update your email after "${formatTime(canUpdateAt)}"`,
        403
      )
    );
  }

  // Update fields

  // Update fields

  user.email = firebaseUser.email || user.email;
  // Save the updated user data
  await user.save();

  return res.status(200).json({
    success: true,
    message: "User email updated successfully",
    user: filterUserDetails(user),
  });
});

const updateUserPhone = AsyncErrorHandler(async (req, res, next) => {
  // first get send otp by auth route and after that use this route

  const { phoneNumber, otp, idToken } = req.body;
  const otpDocument = await Otp.findOne({ phoneNumber, otp, idToken });

  if (otpDocument) {
    await Otp.findByIdAndDelete({ _id: otpDocument._id }); // Delete the OTP document after verifying
    // Find the user by ID (assuming `req.user._id` contains the user ID)
    const user = await User.findById({ _id: new ObjectId(req.user._id) });

    if (!user) {
      return next(new CustomError("Register yourself ", 404));
    }

    // Check if the last update was more than 2 minutes ago
    const lastUpdated = user.updatedAt;
    if (!checkCooldown(lastUpdated, coolDownTimeInMin)) {
      let lastUpdatedAtTime = new Date(lastUpdated);
      const canUpdateAt = new Date(
        lastUpdatedAtTime.getTime() + coolDownTimeInMin * 60 * 1000
      ); // Add 2 minutes to lastUpdated
      return next(
        new CustomError(
          `You can only update your number after "${formatTime(canUpdateAt)}"`,
          403
        )
      );
    }

    // Update fields

    user.phone = phoneNumber || user.phone;
    // Save the updated user data
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User number updated successfully",
      user: filterUserDetails(user),
    });
  } else {
    return next(new CustomError("Invalid or expired OTP", 400));
  }
});

const updateUserImg = AsyncErrorHandler(async (req, res, next) => {
  const { imgKey } = req.body;
  let img;

  // Find the user by ID (assuming `req.user._id` contains the user ID)
  const user = await User.findById({ _id: new ObjectId(req.user._id) });

  if (!user) {
    return next(new CustomError("Register yourself", 404));
  }
  // Check if the last update was more than 2 minutes ago
  const lastUpdated = user.updatedAt;
  if (!checkCooldown(lastUpdated, coolDownTimeInMin)) {
    let lastUpdatedAtTime = new Date(lastUpdated);
    const canUpdateAt = new Date(
      lastUpdatedAtTime.getTime() + coolDownTimeInMin * 60 * 1000
    ); // Add 2 minutes to lastUpdated
    return next(
      new CustomError(
        `You can only update your img after "${formatTime(canUpdateAt)}"`,
        403
      )
    );
  }

  // img key for uploaded img
  if (imgKey) {
    img = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/userProfileImg/${imgKey}`;
  }

  // Update user image
  user.img = img || user.img;

  // Save the updated user data
  await user.save();

  return res.status(200).json({
    success: true,
    message: "User image updated successfully",
    user: filterUserDetails(user),
    imgKey,
    img,
  });
});

module.exports = {
  userData,
  updateUserPhone,
  updateUserEmail,
  updateUserNameAndBdate,
  updateUserImg,
};
