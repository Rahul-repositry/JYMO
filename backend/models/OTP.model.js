// models/OTP.js
const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true },
    otp: { type: String, required: true },
  },
  { timestamps: true }
);
OTPSchema.index({ phoneNumber: 1 });

const Otp = mongoose.model("otp", OTPSchema);
module.exports = Otp;
