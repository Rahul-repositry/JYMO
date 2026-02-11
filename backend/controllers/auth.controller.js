const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const dotenv = require("dotenv");
const { AsyncErrorHandler } = require("../utils/AsyncErrorHandler.utils.js");
const User = require("../models/user.model.js");
const admin = require("../config/firebase.js");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const CustomError = require("../utils/CustomError.utils.js");
const OTP = require("../models/OTP.model.js");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const axios = require("axios");
const { filterUserDetails } = require("../utils/ImpFunc.js");
const { ObjectId } = require("mongoose").Types;

// Other code using these imports

dotenv.config("");

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const userKey = process.env.AWSUSER_ACCESS_KEY;
const secretKey = process.env.AWSUSER_SECRET_KEY;

const s3Client = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: userKey,
    secretAccessKey: secretKey,
  },
});

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "jyymmoo@gmail.com",
    pass: process.env.GMAIL_PASS,
  },
});

const generateMessageId = () => {
  return `${crypto.randomBytes(16).toString("hex")}@yourdomain.com`;
};

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
         <a href="${process.env.FRONTEND_URI}/resetpassword?token=${token}">Reset Password</a>`,
  headers: {
    "Message-ID": generateMessageId(),
  },
});

// All phone otp fun

// in case we need to send custom message by fast2sms

// const sendOTPViaFast2SMS = async (phoneNumber, otp) => {
//   const message = `Your OTP for Jymo app is ${otp}`;
//   console.log(process.env.FAST2SMS_API_KEY);
//   const response = await fast2sms.sendMessage({
//     authorization: process.env.FAST2SMS_API_KEY,
//     message: message,
//     numbers: [phoneNumber],
//   });
//   console.log("is response", response);
//   return response;
// };

const getWalletDetails = async () => {
  const walletOptions = {
    method: "GET",
    url: "https://www.fast2sms.com/dev/wallet",
    headers: {
      authorization: process.env.FAST2SMS_API_KEY,
    },
  };
  const walletResponse = await axios.request(walletOptions);
  const wallet = walletResponse.data.wallet;

  return wallet;
};

const storeOTP = async (phoneNumber, otp) => {
  const otpDocument = new OTP({ phoneNumber, otp });
  let doc = await otpDocument.save();
  return doc;
};

const signin = AsyncErrorHandler(async (req, res, next) => {
  const { password, number } = req.body;

  // Identify if the input is an email or phone number
  let userIdentifier;
  // if (numberOrGmail.includes("@") || numberOrGmail.includes(".")) {
  //   userIdentifier = { email: numberOrGmail };
  // } else {
  userIdentifier = { phone: number };
  // }

  // Find user by email or phone
  const validUser = await User.findOne(userIdentifier);

  if (!validUser) return next(new CustomError("Signup first", 401));

  const validPassword = bcryptjs.compareSync(password, validUser.password);
  if (!validPassword) return next(new CustomError("Invalid credentials", 401));

  const {
    password: hashedPassword,
    resetPasswordToken,
    resetPasswordExpires,
    ...rest
  } = validUser._doc;

  const token = jwt.sign({ user: rest }, process.env.JWT_SECRET, {
    expiresIn: "60d",
  });
  const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60); // 60 days

  res
    .cookie("access_token", token, {
      httpOnly: true,
      expires: expiryDate,
      // secure: true, // Uncomment this line in production to use secure cookies . The secure: true attribute in the cookie configuration ensures that the cookie is only sent over secure HTTPS connections. However, if your HTTPS setup is not fully trusted (e.g., using a self-signed or invalid certificate), modern browsers will reject the cookie, and it will not be stored.
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    })
    .status(200)
    .json({ success: true, message: "SignIn successfully", user: rest });
});

// Google sign-in handler
const google = AsyncErrorHandler(async (req, res, next) => {
  try {
    // Build Firebase credential with the Google ID token.

    const firebaseUser = await admin.auth().verifyIdToken(req.body.idToken);

    if (!firebaseUser.email) {
      return next(new CustomError("Authentication failed", 401));
    }

    // Check if the user exists in the database.
    const existingUser = await User.findOne({ email: firebaseUser.email });

    if (existingUser && existingUser?.phone) {
      // If the user exists, create a JWT token and send it to the client.
      const { password, resetPasswordToken, resetPasswordExpires, ...rest } =
        existingUser._doc;
      const token = jwt.sign({ user: rest }, process.env.JWT_SECRET);
      const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60); // 60 days
      res
        .cookie("access_token", token, {
          httpOnly: true, // helps prevent access to cookie through client-side scripting
          expires: expiryDate,
          // secure: true, // helps with encrypting the cookie and prevents it being sent on http . The secure: true attribute in the cookie configuration ensures that the cookie is only sent over secure HTTPS connections. However, if your HTTPS setup is not fully trusted (e.g., using a self-signed or invalid certificate), modern browsers will reject the cookie, and it will not be stored.
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .json({ success: true, message: "Signin successfully", user: rest });
    } else {
      return next(new CustomError("Signup first to get registered", 401));
    }
  } catch (error) {
    console.error("Error verifying Google ID token:", error);
    next(new CustomError("Authentication failed", 401));
  }
});

//not in use bcz shifted to phone to email
/*const forgotPasswordByEmail = AsyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  if (email.includes("@")) {
    const token = generateToken();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();
    await transporter.sendMail(mailOptions(email, token));
  }

  res.status(200).json({ success: true, message: "Reset instructions sent" });
}); */

// const resetPasswordByEmail = AsyncErrorHandler(async (req, res, next) => {
//   const { token, newPassword } = req.body;

//   const user = await User.findOne({
//     resetPasswordToken: token,
//     resetPasswordExpires: { $gt: Date.now() },
//   });

//   if (!user) {
//     return next(
//       new CustomError("Authentication failed. User is not registered.", 404)
//     );
//   }

//   user.password = bcryptjs.hashSync(newPassword, 10); // hash new password
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpires = undefined;
//   await user.save();

//   res.status(200).send({ success: true, message: "Password has been reset" });
// });

const logout = AsyncErrorHandler(async (req, res, next) => {
  res.clearCookie("access_token");
  return res.status(200).json({
    success: true,
    message: "You are successfully logged out",
  });
});

// const sendOtp = AsyncErrorHandler(async (req, res, next) => {
//   const { phoneNumber } = req.body;
//   console.log(phoneNumber);
//   const otp = generateOTP();
//   const idToken = crypto.randomBytes(16).toString("hex"); // Generate a random ID token
//   const message = `Your OTP for Jymo app is ${otp}`;
//   console.log(process.env.FAST2SMS_API_KEY);
//   var options = {
//     authorization: process.env.FAST2SMS_API_KEY,
//     message: `Your OTP for Jymo app is ${otp} `,
//     numbers: [phoneNumber],
//   };

//   const response = await fast2sms.sendMessage(options);
//   let authorization = process.env.FAST2SMS_API_KEY;
//   const { wallet } = await fast2sms.getWalletBalance(authorization); //{returns {return:true, wallet: XX.XX}}

//   console.log(wallet);

//   await sendOTPViaFast2SMS(phoneNumber, otp);
//   await storeOTP(phoneNumber, otp, idToken);
//   console.log(response, "yhi hai ");
//   res
//     .status(200)
//     .json({ status: "success", msg: "OTP Successfully Sent.", idToken });
// });

// PUT object
const putObject = AsyncErrorHandler(async (req, res, next) => {
  const key = `${crypto.randomBytes(20).toString("hex")}${Date.now()}`;
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: `userProfileImg/${key}`,
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
  res.status(200).json({ status: "success", url, key });
});

const deleteObject = AsyncErrorHandler(async (req, res, next) => {
  const { imgUrl } = req.query; // Get imgUrl from query params
  const userId = req.user._id;

  if (!imgUrl) {
    return next(new CustomError("upload img to delete", 400));
  }

  // Get the user object from the database
  const userObj = await User.findById({ _id: new ObjectId(userId) });

  // Default image URL from environment variable
  const defaultImgUrl = process.env.AWSUSER_DEFAULT_IMG;

  // 1. Check if the image is the default image from the environment
  if (imgUrl === defaultImgUrl) {
    return next(new CustomError("Not a valid image to delete", 400));
  }

  // 2. Check if the image URL is a Google sign-in image
  if (imgUrl.includes("lh3.googleusercontent.com")) {
    res.status(200).json({
      status: "success",
      success: true,
      message: "You can upload a new image",
    });
    return;
  }

  // 3. Check if the image is hosted on S3 and verify it is not the default image
  const urlParts = imgUrl.split("/");
  const key = urlParts[urlParts.length - 1];
  const s3ImageUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/userProfileImg/${key}`;

  if (!imgUrl.includes(`${bucketName}.s3`) || imgUrl === defaultImgUrl) {
    return next(new CustomError("Not a valid image to delete", 400));
  }

  // 4. Verify that the user deleting the image is the owner of the image
  if (userObj.img !== s3ImageUrl) {
    return next(
      new CustomError("You are not authorized to delete this image", 403),
    );
  }

  // 5. Delete the image from S3 if all conditions are met
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: `userProfileImg/${key}`,
  });

  try {
    let s3res = await s3Client.send(command);

    // Check if the S3 deletion was successful by checking status code or response
    if (s3res.$metadata.httpStatusCode === 204) {
      // 6. Update the user's image field to an empty string
      userObj.img = process.env.AWSUSER_DEFAULT_IMG; // Set image to empty
      await userObj.save(); // Save the updated user object

      // Respond with success
      res.status(200).json({
        status: "success",
        success: true,
        response: s3res,
        message: "Image deleted successfully and user image field updated",
      });
    } else {
      return next(new CustomError("Failed to delete image from S3", 500));
    }
  } catch (error) {
    // Handle any errors during the deletion process
    return next(new CustomError("Error deleting image from S3", 500));
  }
});

// wanted to shift to phone from fast2sms to firebase phone otp

// const generateOTP = () => {
//   return crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit OTP
// };
// const generateToken = () => crypto.randomBytes(32).toString("hex");

// // all async handler func

// const signup = AsyncErrorHandler(async (req, res, next) => {
//   // only send firebaseEmailIdToken token instead of email
//   // you have to verify otp here and directly signsup the user otherwise this is very weak signup  change it

//   // img must be uploaded after authentication

//   const {
//     username,
//     age,
//     // firebaseEmailIdToken,
//     password,
//     phoneNumber,
//     birthday,
//     img,
//     isOwner,
//     otpObj,
//     gender,
//   } = req.body;

//   if (!otpObj._id || !otpObj.phoneNumber || !otpObj.otp) {
//     return next(new CustomError("OTP details are incomplete", 404));
//   }

//   // const firebaseUser = await admin.auth().verifyIdToken(firebaseEmailIdToken);

//   // if (!firebaseUser.email) {
//   //   return next(new CustomError("Authentication failed", 401));
//   // }

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
//   const newUser = new User({
//     username,
//     age,
//     password: hashedPassword,
//     phone: phoneNumber,
//     birthday,
//     img,
//     isOwner,
//     gender,
//   });

//   // for  google img new image can only be uploaded after authentication
//   if (img) {
//     newUser.img = img;
//   }

//   /**
//    *  uploading img should be done after authentication
//   // img for google img

//   // img key for uploaded img
//   if (imgKey) {
//     newUser.img = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/userProfileImg/${imgKey}`;
//   }
//  */
//   const savedUser = await newUser.save();

//   await OTP.findByIdAndDelete({ _id: new ObjectId(otpDocument._id) });

//   if (savedUser) {
//     const {
//       password: hashedPassword,
//       resetPasswordToken,
//       resetPasswordExpires,
//       ...rest
//     } = savedUser._doc;

//     const token = jwt.sign({ user: rest }, process.env.JWT_SECRET, {
//       expiresIn: "60d",
//     });
//     const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60); // 60 days

//     res
//       .cookie("access_token", token, {
//         httpOnly: true,
//         expires: expiryDate,
//         // secure: true, // Uncomment this line in production to use secure cookies . The secure: true attribute in the cookie configuration ensures that the cookie is only sent over secure HTTPS connections. However, if your HTTPS setup is not fully trusted (e.g., using a self-signed or invalid certificate), modern browsers will reject the cookie, and it will not be stored.
//         secure: process.env.NODE_ENV === "production",
//       })
//       .status(200)
//       .json({
//         success: true,
//         message: "SignIn successfully",
//         user: filterUserDetails(savedUser),
//       });
//   }

//   // res
//   //   .status(201)
//   //   .json({ success: true, message: "User created successfully", newUser });
// });

// const createForgotSession = AsyncErrorHandler(async (req, res, next) => {
//   const { phone } = req.body;
//   const phonePattern = /^[6789]\d{9}$/;

//   if (!phonePattern.test(phone)) {
//     return next(new CustomError("Invalid phone number format", 400));
//   }

//   const userObj = await User.findOne({ phone: phone });

//   if (!userObj) {
//     return next(new CustomError("User not found with this number", 404));
//   }

//   try {
//     const token = generateToken();
//     userObj.resetPasswordToken = token;
//     userObj.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
//     await userObj.save();

//     res.status(200).json({
//       success: true,
//       message: "Instructions sent successfully",
//       token: token,
//       userId: userObj._id,
//     });
//   } catch (err) {
//     console.error(err);
//     next(
//       new CustomError("An error occurred while processing your request", 500),
//     );
//   }
// });

// const resetPassword = AsyncErrorHandler(async (req, res, next) => {
//   const { userId, token, password: newPassword, otpObj } = req.body;

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

//   let userObj;

//   if (token) {
//     userObj = await User.findById({
//       _id: new ObjectId(userId),
//     });
//   }

//   if (
//     !userObj ||
//     userObj.resetPasswordToken !== token ||
//     userObj.resetPasswordExpires < Date.now()
//   ) {
//     return next(new CustomError("Authentication failed try again !!", 404));
//   }

//   userObj.password = bcryptjs.hashSync(newPassword, 10); // hash new password
//   userObj.resetPasswordToken = "";
//   userObj.resetPasswordExpires = 0;
//   await userObj.save();
//   await OTP.findByIdAndDelete({ _id: new ObjectId(otpDocument._id) });

//   res.status(201).send({ success: true, message: "Password has been reset" });
// });

// const sendOtp = AsyncErrorHandler(async (req, res, next) => {
//   const { phoneNumber } = req.body;

//   // Validate the phone number
//   if (!phoneNumber || typeof phoneNumber !== "string") {
//     return res.status(400).json({
//       status: "error",
//       message: "Invalid or missing phone number.",
//     });
//   }

//   const otpPass = generateOTP();
//   // console.log(otpPass);
//   const options = {
//     method: "GET",
//     url: "https://www.fast2sms.com/dev/bulkV2",
//     params: {
//       authorization: process.env.FAST2SMS_API_KEY,
//       variables_values: otpPass,
//       route: "otp",
//       flash: "0",
//       numbers: phoneNumber,
//     },
//     headers: {
//       "cache-control": "no-cache",
//     },
//   };

//   try {
//     // Send the OTP via Fast2SMS API
//     // await axios.request(options);

//     // Log response status for debugging

//     // Store the OTP in the database
//     const otp = await storeOTP(phoneNumber, otpPass);
//     console.log(otp);
//     // console.log(otp);
//     // Respond with success
//     return res.status(200).json({
//       status: "success",
//       message: "OTP successfully sent.",
//       otp: {
//         _id: otp._id,
//         phoneNumber: otp.phoneNumber,
//       },
//     });
//   } catch (error) {
//     // Distinguish between API errors and other issues
//     if (error.response) {
//       console.error(
//         `Fast2SMS API error: ${error.response.status} - ${error.response.data}`,
//       );
//       return res.status(502).json({
//         status: "error",
//         message:
//           "Failed to send OTP due to an external service error. Please try again later.",
//       });
//     } else {
//       console.error(`Internal error while sending OTP: ${error.message}`);
//       return res.status(500).json({
//         status: "error",
//         message: "An internal error occurred. Please try again later.",
//       });
//     }
//   }
// });

// // once it will be verified on 1st page of signup and after during creation

// const verifyOtp = AsyncErrorHandler(async (req, res, next) => {
//   const { phoneNumber, otp, _id } = req.body;

//   const otpDocument = await OTP.findById({ _id: new ObjectId(_id) });

//   if (!otpDocument) {
//     return next(new CustomError("Not Found", 404));
//   }
//   if (
//     otpDocument.otp !== otp ||
//     otpDocument.phoneNumber !== phoneNumber ||
//     !String(otpDocument._id).includes(_id)
//   ) {
//     return next(new CustomError("Invalid  OTP", 400));
//   }

//   return res
//     .status(200)
//     .json({ status: "success", msg: "OTP Successfully verified" });
// });

const signup = AsyncErrorHandler(async (req, res, next) => {
  const {
    username,
    age,
    password,
    phoneNumber,
    birthday,
    img,
    isOwner,
    gender,
    firebaseToken, // Received from frontend after OTP verification
  } = req.body;

  if (!firebaseToken) {
    return next(new CustomError("Phone verification token is missing", 400));
  }

  try {
    // 1. Verify the Firebase Token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const firebasePhone = decodedToken.phone_number;

    // Optional: Cross-check if the phone number matches the one in req.body
    // Note: Firebase phone numbers include country codes (e.g., +91...)
    if (!firebasePhone.includes(phoneNumber.replace(/\D/g, ""))) {
      return next(new CustomError("Phone number mismatch", 400));
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ phone: phoneNumber });
    if (existingUser) {
      return next(
        new CustomError("User already registered with this number", 400),
      );
    }

    // 3. Create User
    const hashedPassword = bcryptjs.hashSync(String(password), 10);
    const newUser = new User({
      username,
      age,
      password: hashedPassword,
      phone: phoneNumber,
      birthday,
      img,
      isOwner,
      gender,
    });

    const savedUser = await newUser.save();

    // 4. Generate Local JWT for Session
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "60d",
    });

    const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60);

    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: expiryDate,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      })
      .status(201)
      .json({
        success: true,
        message: "User registered successfully",
        user: filterUserDetails(savedUser),
      });
  } catch (error) {
    console.error("Firebase Verify Error:", error);
    return next(
      new CustomError("Invalid or expired phone verification session", 401),
    );
  }
});

const resetPassword = AsyncErrorHandler(async (req, res, next) => {
  const { firebaseToken, password: newPassword, phone } = req.body;

  if (!firebaseToken) {
    return next(new CustomError("Verification token is required", 400));
  }

  try {
    // 1. Verify the Firebase Token (This proves the user owns the phone)
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const verifiedPhone = decodedToken.phone_number;

    // 2. Security Check: Ensure the token phone matches the requested phone
    // Firebase phone numbers are in E.164 format (e.g., +919876543210)
    if (!verifiedPhone.includes(phone.replace(/\D/g, ""))) {
      return next(new CustomError("Token/Phone number mismatch", 401));
    }

    // 3. Find user and update password
    const userObj = await User.findOne({ phone: phone });

    if (!userObj) {
      return next(new CustomError("User no longer exists", 404));
    }

    // 4. Hash and Save
    const salt = bcryptjs.genSaltSync(10);
    userObj.password = bcryptjs.hashSync(String(newPassword), salt);

    // Clear any old legacy fields if they exist
    userObj.resetPasswordToken = undefined;
    userObj.resetPasswordExpires = undefined;

    await userObj.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully. Please login.",
    });
  } catch (error) {
    console.error("Firebase Reset Error:", error);
    return next(
      new CustomError("Session expired or invalid OTP. Try again.", 401),
    );
  }
});

// Since Firebase handles the OTP sending, the "sendOtp" and "verifyOtp"
// backend routes are technically no longer needed for the signup flow,
// as the frontend communicates directly with Firebase.

module.exports = {
  signup,
  signin,
  logout,
  google,
  resetPassword,
  deleteObject,
  putObject,
};
