const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const dotenv = require("dotenv");
const { AsyncErrorHandler } = require("../utils/AsyncErrorHandler.utils.js");
const OTP = require("../models/OTP.model.js");
const nodemailer = require("nodemailer");
const Jym = require("../models/jym.model.js");
const crypto = require("crypto");
const CustomError = require("../utils/CustomError.utils.js");
const { filterJymDetails } = require("../utils/ImpFunc.js");
const { ObjectId } = require("mongoose").Types;
const admin = require("../config/firebase.js");

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

// const jymSignup = AsyncErrorHandler(async (req, res, next) => {
//   //img be updated manually by admin

//   const {
//     name,
//     recoveryNumber,
//     password,
//     numbers,
//     geolocation,
//     addressLocation,
//     subscriptionFee,
//     otpObj,
//   } = req.body;

//   if (!req.user.isOwner) {
//     return next(new CustomError("Change your ownership status.", 403));
//   }

//   if (!otpObj._id || !otpObj.phoneNumber || !otpObj.otp) {
//     return next(new CustomError("OTP details are incomplete", 404));
//   }

//   const otpDocument = await OTP.findById({ _id: new ObjectId(otpObj._id) });

//   if (!otpDocument) {
//     return next(new CustomError("Start the signup again ", 400));
//   }

//   if (
//     otpDocument.otp !== otpObj.otp ||
//     otpDocument.phoneNumber !== otpObj.phoneNumber ||
//     !String(otpDocument._id).includes(otpObj._id)
//   ) {
//     return next(new CustomError("Invalid  OTP", 400));
//   }

//   const hashedPassword = bcryptjs.hashSync(String(password), 10);

//   const newJym = new Jym({
//     name,
//     recoveryNumber,
//     password: hashedPassword,
//     numbers,
//     owners: req.user._id,
//     geolocation,
//     addressLocation,
//     subscriptionFee,
//   });

//   const savedJym = await newJym.save();
//   await OTP.findByIdAndDelete({ _id: new ObjectId(otpDocument._id) });

//   res.status(201).json({
//     success: true,
//     message: "Jym created successfully",
//     jymAdmin: filterJymDetails(savedJym),
//   });
// });

const jymSignin = AsyncErrorHandler(async (req, res, next) => {
  const { jymUniqueId, password } = req.body;
  const ownerId = req.user._id;

  // Validate gym existence
  const validJym = await Jym.findOne({ jymUniqueId: jymUniqueId });
  if (!validJym) return next(new CustomError("Create Jym first", 401));

  // Validate password
  const validPassword = bcryptjs.compareSync(password, validJym.password);
  if (!validPassword) return next(new CustomError("Invalid credentials", 401));

  // Generate token
  const token = jwt.sign({ id: validJym._id }, process.env.JWT_SECRET);
  const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60); // 60 days

  // Ensure ownerId is included in the owners array
  if (!validJym.owners.some((owner) => owner.equals(ownerId))) {
    validJym.owners.push(ownerId);

    try {
      await validJym.save(); // Save the updated document
    } catch (error) {
      console.error("Failed to update owners array:", error);
      return next(new CustomError("Unable to update owners. Try again.", 500));
    }
  }

  // Respond with a success message
  return res
    .cookie("access_jymToken", token, {
      httpOnly: true,
      expires: expiryDate,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    })
    .status(200)
    .json({
      success: true,
      message: "SignIn successfully",
      jymAdmin: filterJymDetails(validJym),
    });
});

// chq by asking gpt that why even after res.cookie why cookie is not getting set to frontend
// const jymId = AsyncErrorHandler(async (req, res, next) => {
//   const userId = req.user._id;
//   const newjymId = new JymId({
//     userId,
//   });
//   const savedjym = await newjymId.save();

//   res
//     .status(201)
//     .json({ success: true, message: "Jym created successfully", savedjym });
// });

// const forgotPassword = AsyncErrorHandler(async (req, res, next) => {
//   //this will show all of the jyms that have this recovery number
//   const { recoveryNumber } = req.body;
//   const phonePattern = /^[6789]\d{9}$/;

//   if (phonePattern.test(recoveryNumber)) {
//     const JymObj = await Jym.find({ recoveryNumber: recoveryNumber }).select(
//       "name jymUniqueId",
//     );

//     if (JymObj.length === 0) {
//       return next(new CustomError("Jym not found with this number", 404));
//     }

//     // const token = generateToken();
//     // JymObj.resetPasswordToken = token;
//     // JymObj.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
//     // await JymObj.save();

//     //otp will be send by sendotp route
//     // otp will be verified by verify otp route and then show the update password input in frontend
//     //then reset password with otp number and toke will be first these will be verified then changes will made

//     res.status(200).json({
//       success: true,
//       message: "jym Sent instructions sent",
//       // token: token,
//       jymData: JymObj,
//     });
//     return;
//   }

//   next(new CustomError("Number is incorrect", 404));
//   return;
// });

// const createForgotSession = AsyncErrorHandler(async (req, res, next) => {
//   const { jymId } = req.body;
//   try {
//     const JymObj = await Jym.findOne({ _id: jymId });

//     if (!JymObj) {
//       return next(new CustomError("Jym not found with this number", 404));
//     }

//     const token = generateToken();
//     JymObj.resetPasswordToken = token;
//     JymObj.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
//     await JymObj.save();

//     res.status(200).json({
//       success: true,
//       message: "jym Sent instructions sent",
//       token: token,
//     });
//     return;
//   } catch (err) {
//     next(new CustomError("Jym is incorrect", 404));
//     return;
//   }
// });

// const resetPassword = AsyncErrorHandler(async (req, res, next) => {
//   const { jymId, token, password: newPassword, otpObj } = req.body;

//   if (!otpObj._id || !otpObj.phoneNumber || !otpObj.otp) {
//     return next(new CustomError("OTP details are incomplete", 404));
//   }

//   const otpDocument = await OTP.findById({ _id: new ObjectId(otpObj._id) });

//   if (!otpDocument) {
//     return next(new CustomError("Invalid OTP", 400));
//   }

//   if (
//     otpDocument.otp !== otpObj.otp ||
//     otpDocument.phoneNumber !== otpObj.phoneNumber ||
//     !String(otpDocument._id).includes(otpObj._id)
//   ) {
//     return next(new CustomError("Invalid  OTP", 400));
//   }

//   let jymObj;

//   if (token) {
//     jymObj = await Jym.findById({
//       _id: new ObjectId(jymId),
//     });
//   }

//   if (
//     !jymObj ||
//     jymObj.resetPasswordToken !== token ||
//     jymObj.resetPasswordExpires < Date.now()
//   ) {
//     return next(new CustomError("Authentication failed try again !!", 404));
//   }

//   jymObj.password = bcryptjs.hashSync(newPassword, 10); // hash new password
//   jymObj.resetPasswordToken = "";
//   jymObj.resetPasswordExpires = 0;
//   await jymObj.save();
//   await OTP.findByIdAndDelete({ _id: new ObjectId(otpDocument._id) });

//   res.status(201).send({ success: true, message: "Password has been reset" });
// });

const logout = AsyncErrorHandler(async (req, res, next) => {
  const ownerId = req.user._id;

  // Find the gym by ID
  const validJym = await Jym.findById({ _id: new ObjectId(req.jym._id) });

  if (!validJym) {
    return next(new CustomError("Jym not found", 404));
  }

  // Remove the owner using `filter` if it exists
  validJym.owners = validJym.owners.filter((owner) => !owner.equals(ownerId));

  // Save the updated document
  await validJym.save();

  // Send the response while clearing the cookie
  res
    .status(200)
    .clearCookie("access_jymToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .json({
      status: "success",
      msg: "You are successfully logged out",
    });
});

/**
 * HELPER: Verifies the Firebase Token
 */
const verifyFirebaseToken = async (token) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new CustomError(
      "Phone verification expired or invalid. Please try again.",
      401,
    );
  }
};

/**
 * JYM SIGNUP (Admin Creation)
 */
const jymSignup = AsyncErrorHandler(async (req, res, next) => {
  const {
    name,
    recoveryNumber,
    password,
    numbers,
    geolocation,
    addressLocation,
    subscriptionFee,
    firebaseIdToken, // Received from frontend after Firebase OTP success
  } = req.body;

  // 1. Ownership Check
  if (!req.user.isOwner) {
    return next(
      new CustomError(
        "You do not have permission to create a Jym admin account.",
        403,
      ),
    );
  }

  console.log(req.user);
  // 2. Firebase Security Check
  if (!firebaseIdToken) {
    return next(
      new CustomError("Security verification (OTP) is missing.", 400),
    );
  }

  const decodedToken = await verifyFirebaseToken(firebaseIdToken);

  // Verify that the number verified by Firebase matches the recovery number provided
  const firebasePhone = decodedToken.phone_number;
  if (!firebasePhone.includes(recoveryNumber)) {
    return next(
      new CustomError(
        "Verified phone number does not match the recovery number.",
        403,
      ),
    );
  }

  // 3. Logic to create Jym
  const hashedPassword = bcryptjs.hashSync(String(password), 10);

  const newJym = new Jym({
    name,
    recoveryNumber,
    password: hashedPassword,
    numbers,
    owners: [req.user._id], // Initial owner is the user creating it
    geolocation,
    addressLocation,
    subscriptionFee,
  });

  const savedJym = await newJym.save();

  res.status(201).json({
    success: true,
    message: "Jym admin account created successfully",
    jymAdmin: filterJymDetails(savedJym),
  });
});

/**
 * RESET PASSWORD (Using Firebase)
 */
const jymResetPassword = AsyncErrorHandler(async (req, res, next) => {
  const {
    jymId,
    firebaseIdToken,
    password: newPassword,
    recoveryNumber,
  } = req.body;

  if (!firebaseIdToken)
    return next(new CustomError("Verification required.", 400));

  const decoded = await verifyFirebaseToken(firebaseIdToken);

  // Ensure the phone verified matches the recovery number
  if (!decoded.phone_number.includes(recoveryNumber)) {
    return next(new CustomError("Phone verification mismatch.", 403));
  }

  const jymObj = await Jym.findById(jymId);
  if (!jymObj) return next(new CustomError("Jym account not found.", 404));

  jymObj.password = bcryptjs.hashSync(newPassword, 10);
  await jymObj.save();

  res
    .status(200)
    .json({ success: true, message: "Jym password reset successful." });
});

module.exports = { jymSignup, jymSignin, jymResetPassword, logout };

// module.exports = {
//   jymSignup,
//   jymSignin,
//   logout,
//   forgotPassword,
//   createForgotSession,
//   resetPassword,
// };
