const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const dotenv = require("dotenv");
const { AsyncErrorHandler } = require("../utils/AsyncErrorHandler.utils.js");
const OTP = require("../models/OTP.model.js");
const nodemailer = require("nodemailer");
const Jym = require("../models/jym.model.js");
const JymId = require("../models/jymId.model.js");
const crypto = require("crypto");
const CustomError = require("../utils/CustomError.utils.js");
const { filterJymDetails } = require("../utils/ImpFunc.js");
const { ObjectId } = require("mongoose").Types;

dotenv.config("");

const generateToken = () => crypto.randomBytes(32).toString("hex");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jyymmoo@gmail.com",
    pass: process.env.GMAIL_PASS,
  },
});

// const mailOptions = (userEmail, token) => ({
//   from: "jyymmoo@gmail.com",
//   to: userEmail,
//   subject: "Password Reset Request",
//   text: `You requested a Jym password reset. Click the link to reset your Jym password:
// ${process.env.FRONTEND_URI}/reset-password?token=${token}`,
//   html: `<p>You requested a password reset. Click the link to reset your password:</p>
//          <a href="${process.env.FRONTEND_URI}/reset-password?token=${token}">Reset Password</a>`,
// });

// Function to generate a unique message ID
const generateMessageId = () => {
  return `${crypto.randomBytes(16).toString("hex")}@yourdomain.com`;
};

// Function to generate a unique subject (you can customize this logic)
const generateUniqueSubject = (baseSubject) => {
  const timestamp = new Date().getTime();
  return `${baseSubject} - ${timestamp}`;
};

const mailOptions = (userEmail, token) => ({
  from: "jyymmoo@gmail.com",
  to: userEmail,
  subject: generateUniqueSubject("Password Reset Request"),
  text: `You requested a Jym password reset. Click the link to reset your Jym password: 
${process.env.FRONTEND_URI}/reset-password?token=${token}`,
  html: `<p>You requested a password reset. Click the link to reset your password:</p>
         <a href="${process.env.FRONTEND_URI}/reset-password?token=${token}">Reset Password</a>`,
  headers: {
    "Message-ID": generateMessageId(),
  },
});

const jymSignup = AsyncErrorHandler(async (req, res, next) => {
  console.log(req.user);
  //img be updated manually by admin

  const {
    name,
    recoveryNumber,
    password,
    numbers,
    geolocation,
    addressLocation,
    subscriptionFee,
    otpObj,
  } = req.body;

  if (!req.user.isOwner) {
    return next(new CustomError("Change your ownership status.", 403));
  }

  if (!otpObj._id || !otpObj.phoneNumber || !otpObj.otp) {
    return next(new CustomError("OTP details are incomplete", 404));
  }

  const otpDocument = await OTP.findById({ _id: new ObjectId(otpObj._id) });

  if (!otpDocument) {
    return next(new CustomError("Start the signup again ", 400));
  }

  if (
    otpDocument.otp !== otpObj.otp ||
    otpDocument.phoneNumber !== otpObj.phoneNumber ||
    !String(otpDocument._id).includes(otpObj._id)
  ) {
    return next(new CustomError("Invalid  OTP", 400));
  }

  const hashedPassword = bcryptjs.hashSync(String(password), 10);

  const newJym = new Jym({
    name,
    recoveryNumber,
    password: hashedPassword,
    numbers,
    owners: req.user._id,
    geolocation,
    addressLocation,
    subscriptionFee,
  });

  const savedJym = await newJym.save();
  await OTP.findByIdAndDelete({ _id: new ObjectId(otpDocument._id) });

  res.status(201).json({
    success: true,
    message: "Jym created successfully",
    jymAdmin: filterJymDetails(savedJym),
  });
});

const jymSignin = AsyncErrorHandler(async (req, res, next) => {
  const { jymUniqueId, password } = req.body;
  const ownerId = req.user._id;
  const validJym = await Jym.findOne({ jymUniqueId: jymUniqueId });
  if (!validJym) return next(new CustomError("Create Jym first", 401));
  const validPassword = bcryptjs.compareSync(password, validJym.password);
  if (!validPassword) return next(new CustomError("invalid credentials", 401));
  const token = jwt.sign({ id: validJym._id }, process.env.JWT_SECRET);

  const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60); // 60 days
  let jymobj;
  if (!validJym.owners.includes(ownerId)) {
    validJym.owners.push(ownerId);
    jymobj = await validJym.save();
  }

  res
    .cookie("access_jymToken", token, {
      httpOnly: true, // helps  prevent access to cookie through client-side scripting
      expires: expiryDate,
      // secure: true, // helps  with encrypting the cookie and prevents it being sent on http
    })
    .status(200)
    .json({ success: true, message: "SignIn successfully", jymobj });
});

const jymId = AsyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const newjymId = new JymId({
    userId,
  });
  const savedjym = await newjymId.save();

  res
    .status(201)
    .json({ success: true, message: "Jym created successfully", savedjym });
});

const forgotPassword = AsyncErrorHandler(async (req, res, next) => {
  const { recoveryNumber } = req.body;
  const phonePattern = /^[6789]\d{9}$/;

  if (phonePattern.test(recoveryNumber)) {
    const JymObj = await Jym.find({ recoveryNumber: recoveryNumber }).select(
      "name jymUniqueId"
    );

    if (JymObj.length === 0) {
      return next(new CustomError("Jym not found with this number", 404));
    }

    // const token = generateToken();
    // JymObj.resetPasswordToken = token;
    // JymObj.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    // await JymObj.save();

    //otp will be send by sendotp route
    // otp will be verified by verify otp route and then show the update password input in frontend
    //then reset password with otp number and toke will be first these will be verified then changes will made

    res.status(200).json({
      success: true,
      message: "jym Sent instructions sent",
      // token: token,
      jymData: JymObj,
    });
    return;
  }

  next(new CustomError("Number is incorrect", 404));
  return;
});

const createForgotSession = AsyncErrorHandler(async (req, res, next) => {
  const { jymId } = req.body;
  try {
    const JymObj = await Jym.findOne({ _id: jymId });

    if (!JymObj) {
      return next(new CustomError("Jym not found with this number", 404));
    }

    const token = generateToken();
    JymObj.resetPasswordToken = token;
    JymObj.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await JymObj.save();

    res.status(200).json({
      success: true,
      message: "jym Sent instructions sent",
      token: token,
    });
    return;
  } catch (err) {
    next(new CustomError("Jym is incorrect", 404));
    return;
  }
});

const resetPassword = AsyncErrorHandler(async (req, res, next) => {
  const { jymId, token, password: newPassword, otpObj } = req.body;
  console.log({
    body: req.body,
  });
  console.log({ jymId, token, newPassword, otpObj });
  if (!otpObj._id || !otpObj.phoneNumber || !otpObj.otp) {
    return next(new CustomError("OTP details are incomplete", 404));
  }

  const otpDocument = await OTP.findById({ _id: new ObjectId(otpObj._id) });

  if (!otpDocument) {
    return next(new CustomError("Invalid OTP", 400));
  }

  if (
    otpDocument.otp !== otpObj.otp ||
    otpDocument.phoneNumber !== otpObj.phoneNumber ||
    !String(otpDocument._id).includes(otpObj._id)
  ) {
    return next(new CustomError("Invalid  OTP", 400));
  }

  let jymObj;

  if (token) {
    jymObj = await Jym.findById({
      _id: new ObjectId(jymId),
    });
  }

  if (
    !jymObj ||
    jymObj.resetPasswordToken !== token ||
    jymObj.resetPasswordExpires < Date.now()
  ) {
    return next(new CustomError("Authentication failed try again !!", 404));
  }

  jymObj.password = bcryptjs.hashSync(newPassword, 10); // hash new password
  jymObj.resetPasswordToken = "";
  jymObj.resetPasswordExpires = 0;
  await jymObj.save();
  await OTP.findByIdAndDelete({ _id: new ObjectId(otpDocument._id) });

  res.status(201).send({ success: true, message: "Password has been reset" });
});

const logout = AsyncErrorHandler(async (req, res, next) => {
  const ownerId = req.user._id;
  const validJym = await Jym.findOne({ _id: req.jym._id });

  if (!validJym) throw new Error("Jym not found");

  if (!validJym.owners.includes(ownerId)) {
    validJym.owners.pull(ownerId);
    await validJym.save();
  }

  res.clearCookie("access_jymToken");
  return res.status(200).json({
    status: "success",
    msg: "You are successfully logged out",
  });
});

module.exports = {
  jymSignup,
  jymSignin,
  logout,
  jymId,
  forgotPassword,
  createForgotSession,
  resetPassword,
};
