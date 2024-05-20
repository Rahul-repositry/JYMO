import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

const userSchema = new mongoose.Schema(
  {
    userUniqueId: {
      type: Number,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
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
    isActive: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
      required: true,
    },
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

// Add the auto-increment plugin to the schema
userSchema.plugin(AutoIncrement, { inc_field: "userUniqueId" });

const User = mongoose.model("User", userSchema);

export default User;
