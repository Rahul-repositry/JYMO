const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const dotenv = require("dotenv");
const { AsyncErrorHandler } = require("../utils/AsyncErrorHandler.utils.js");

const nodemailer = require("nodemailer");
const { Jym } = require("../models/jym.model.js");
const { JymId } = require("../models/jymId.model.js");
const crypto = require("crypto");
const CustomError = require("../utils/CustomError.utils.js");

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
  const {
    name,
    jymId,
    recoveryEmail,
    password,
    numbers,
    ownerId,
    geolocation,
    addressLocation,
    img,
    subscriptionFee,
  } = req.body;
  const hashedPassword = bcryptjs.hashSync(String(password), 10);

  const newJym = new Jym({
    name,
    jymId,
    recoveryEmail,
    password: hashedPassword,
    numbers,
    owners: ownerId,
    geolocation,
    addressLocation,
    subscriptionFee,
  });

  if (img) {
    newJym.img = img;
  }

  const savedJym = await newJym.save();

  res
    .status(201)
    .json({ success: true, message: "Jym created successfully", savedJym });
});

const jymSignin = AsyncErrorHandler(async (req, res, next) => {
  const { jymId, password } = req.body;
  const ownerId = req.user._id;
  const validJym = await Jym.findOne({ jymId });
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
  const { email } = req.body;
  const JymObj = await Jym.findOne({
    recoveryEmail: email,
  });

  if (!JymObj) {
    return next(new CustomError("Jym not found", 404));
  }

  if (email.includes("@")) {
    const token = generateToken();
    JymObj.resetPasswordToken = token;
    JymObj.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await JymObj.save();
    await transporter.sendMail(mailOptions(email, token));
  }

  res.status(200).json({ success: true, message: "Reset instructions sent" });
});

const resetPassword = AsyncErrorHandler(async (req, res, next) => {
  const { token, newPassword } = req.body;
  let jymObj;

  if (token) {
    jymObj = await Jym.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
  }

  if (!jymObj) {
    return next(new CustomError("Authentication failed try again !!", 404));
  }

  jymObj.password = bcryptjs.hashSync(newPassword, 10); // hash new password
  jymObj.resetPasswordToken = undefined;
  jymObj.resetPasswordExpires = undefined;
  await jymObj.save();

  res.status(201).send({ success: true, message: "Password has been reset" });
});
const logout = AsyncErrorHandler(async (req, res, next) => {
  const ownerId = req.user._id;
  const validJym = await Jym.findOne({ _id: req.jym.id });
  console.log(validJym, req.jym.id);
  if (!validJym) throw new Error("Jym not found");

  if (!validJym.owners.includes(ownerId)) {
    validJym.owners.pull(ownerId);
    await validJym.save();
  }

  res.clearCookie("access_jymToken");
  return res.json({
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
  resetPassword,
};
