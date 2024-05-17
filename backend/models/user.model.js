import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    birthday: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["gymOwner", "user"],
      required: true,
    },
    isActive: { type: String },
    gymId: {
      type: String,
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
    lastPaymentDate: {
      type: Date,
    },
    subscriptionStartDate: {
      type: Date,
    },
    subscriptionEndDate: {
      type: Date,
    },
    subscriptionType: {
      type: String,
      enum: ["trial", "premium"],
      default: "trial",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
