import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { AsyncErrorHandler } from "../utils/AsyncErrorHandler.utils.js";
import User from "../models/user.model.js";
import admin from "../config/firebase.js";

export const signup = AsyncErrorHandler(async (req, res, next) => {
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

  res.status(201).json({ message: "User created successfully", savedUser });
});

export const signin = AsyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const validUser = await User.findOne({ email });
  if (!validUser) return next(new CustomError("Signup first", 401));
  const validPassword = bcryptjs.compareSync(password, validUser.password);
  if (!validPassword) return next(new CustomError("invalid credentials", 401));
  const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
  const { password: hashedPassword, ...rest } = validUser._doc;
  const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60); // 60 days
  res
    .cookie("access_token", token, {
      httpOnly: true, // helps  prevent access to cookie through client-side scripting
      expires: expiryDate,
      // secure: true, // helps  with encrypting the cookie and prevents it being sent on http
    })
    .status(200)
    .json(rest);
});

// Google sign-in handler
export const google = AsyncErrorHandler(async (req, res, next) => {
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
      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);
      const { password, ...rest } = existingUser._doc;
      const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60); // 60 days
      res
        .cookie("access_token", token, {
          httpOnly: true, // helps prevent access to cookie through client-side scripting
          expires: expiryDate,
          // secure: true, // helps with encrypting the cookie and prevents it being sent on http
        })
        .status(200)
        .json(rest);
    } else {
      // If the user does not exist, create a new user and send a JWT token to the client.
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const { username, age, email, phone, birthday, role, img, gender } =
        req.body;
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
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password, ...rest } = newUser._doc;
      const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60); // 60 days
      res
        .cookie("access_token", token, {
          httpOnly: true, // helps prevent access to cookie through client-side scripting
          expires: expiryDate,
          // secure: true, // helps with encrypting the cookie and prevents it being sent on http
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    console.error("Error verifying Google ID token:", error);
    next(new CustomError("Authentication failed", 401));
  }
});
