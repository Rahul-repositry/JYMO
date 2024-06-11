const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const dotenv = require("dotenv");
const { AsyncErrorHandler } = require("../utils/AsyncErrorHandler.utils.js");
const User = require("../models/user.model.js");
const admin = require("../config/firebase.js");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const CustomError = require("../utils/CustomError.utils.js");
// Other code using these imports

dotenv.config("");

const generateToken = () => crypto.randomBytes(32).toString("hex");

const transporter = nodemailer.createTransport({
  service: "gmail",
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
         <a href="${process.env.FRONTEND_URI}/reset-password?token=${token}">Reset Password</a>`,
  headers: {
    "Message-ID": generateMessageId(),
  },
});

const signup = AsyncErrorHandler(async (req, res, next) => {
  const { username, age, email, password, phone, birthday, role, img, gender } =
    req.body;
  const hashedPassword = bcryptjs.hashSync(String(password), 10);

  const newUser = new User({
    username,
    age,
    email,
    password: hashedPassword,
    phone,
    birthday,
    role,
    gender,
  });

  if (img) {
    newUser.img = img;
  }

  const savedUser = await newUser.save();

  res
    .status(201)
    .json({ success: true, message: "User created successfully", savedUser });
});

const signin = AsyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const validUser = await User.findOne({ email });
  if (!validUser) return next(new CustomError("Signup first", 401));
  const validPassword = bcryptjs.compareSync(password, validUser.password);
  if (!validPassword) return next(new CustomError("invalid credentials", 401));
  const {
    password: hashedPassword,
    resetPasswordToken,
    resetPasswordExpires,
    ...rest
  } = validUser._doc;
  const token = jwt.sign({ user: rest }, process.env.JWT_SECRET);
  const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60); // 60 days
  res
    .cookie("access_token", token, {
      httpOnly: true, // helps  prevent access to cookie through client-side scripting
      expires: expiryDate,
      // secure: true, // helps  with encrypting the cookie and prevents it being sent on http
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

    if (existingUser) {
      // If the user exists, create a JWT token and send it to the client.
      const { password, resetPasswordToken, resetPasswordExpires, ...rest } =
        existingUser._doc;
      const token = jwt.sign({ user: rest }, process.env.JWT_SECRET);
      const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60); // 60 days
      res
        .cookie("access_token", token, {
          httpOnly: true, // helps prevent access to cookie through client-side scripting
          expires: expiryDate,
          // secure: true, // helps with encrypting the cookie and prevents it being sent on http
        })
        .status(200)
        .json({ success: true, message: "Signin successfully", user: rest });
    } else {
      // If the user does not exist, create a new user and send a JWT token to the client.
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const { age, phone, birthday, role, img, gender } = req.body;
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          firebaseUser.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8),
        age,
        email: firebaseUser.email,
        password: hashedPassword,
        phone,
        birthday,
        gender,
        role,
      });

      if (img) {
        newUser.img = img || firebaseUser.picture;
      }

      await newUser.save();
      const { password, resetPasswordToken, resetPasswordExpires, ...rest } =
        newUser._doc;
      const token = jwt.sign({ user: rest }, process.env.JWT_SECRET);
      const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60); // 60 days
      res
        .cookie("access_token", token, {
          httpOnly: true, // helps prevent access to cookie through client-side scripting
          expires: expiryDate,
          // secure: true, // helps with encrypting the cookie and prevents it being sent on http
        })
        .status(200)
        .json({ success: true, message: "SignIn Successfully", user: rest });
    }
  } catch (error) {
    console.error("Error verifying Google ID token:", error);
    next(new CustomError("Authentication failed", 401));
  }
});

const forgotPassword = AsyncErrorHandler(async (req, res, next) => {
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
});

const resetPassword = AsyncErrorHandler(async (req, res, next) => {
  const { token, idToken, phoneNumber, newPassword } = req.body;
  let user;

  if (token) {
    user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
  } else if (idToken) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);

      if (!decodedToken) {
        return next(new CustomError("Invalid token", 400));
      }

      user = await User.findOne({
        phone: decodedToken?.phone_number,
      });

      if (user.phone != phoneNumber) {
        return next(new CustomError("Send your own details", 401));
      }
    } catch (error) {
      return next(new CustomError("Invalid ID token", 400));
    }
  }

  if (!user) {
    return next(new CustomError("Authentication failed try again", 400));
  }

  user.password = bcryptjs.hashSync(newPassword, 10); // hash new password
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const savedUser = await user.save();
  console.log(savedUser);

  res.status(201).send({ success: true, message: "Password has been reset" });
});

const logout = AsyncErrorHandler(async (req, res, next) => {
  res.clearCookie("access_token");
  return res.json({
    status: "success",
    msg: "You are successfully logged out",
  });
});

module.exports = {
  signup,
  signin,
  logout,
  google,
  forgotPassword,
  resetPassword,
};
