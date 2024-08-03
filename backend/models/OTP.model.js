// models/OTP.js
const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  otp: { type: String, required: true },
  idToken: { type: String, required: true },
  createdAt: { type: Date, expires: 120, default: Date.now }, // Document will expire after 2 minutes
});

const Otp = mongoose.model("otp", OTPSchema);
module.exports = Otp;
