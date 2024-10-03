const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

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
        "https://jymo.s3.ap-south-1.amazonaws.com/userProfileImg/05b8aecb079968b9386383d30cfea4446f76b1781722583225465",
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    birthday: {
      type: String,
    },
    isOwner: {
      type: Boolean,
      default: false,
    },
    /* isActive: {
    //   type: String,
    // },*/
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },
    currentJymUUId: [
      {
        jymId: { type: mongoose.Schema.Types.ObjectId, ref: "jyms" },
        name: { type: String },
      },
    ], //currently active in these jyms.

    resetPasswordToken: { type: String, default: "" },
    resetPasswordExpires: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

// Add the auto-increment plugin to the schema
userSchema.plugin(AutoIncrement, { inc_field: "userUniqueId" });

const User = mongoose.model("user", userSchema);

module.exports = User;
