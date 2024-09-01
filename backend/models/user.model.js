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
    isOwner: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: String,
    },
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

    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

// Add the auto-increment plugin to the schema
userSchema.plugin(AutoIncrement, { inc_field: "userUniqueId" });

const User = mongoose.model("user", userSchema);

module.exports = User;
