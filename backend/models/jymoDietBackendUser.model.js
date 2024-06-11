const mongoose = require("mongoose");
const { Schema } = mongoose;

const jymoDietBackendUser = new Schema(
  {
    username: { type: String, required: true },
    gmail: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "cook", "transporter", "user"],
      default: "user",
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("jymoDietBackendUser", jymoDietBackendUser);
