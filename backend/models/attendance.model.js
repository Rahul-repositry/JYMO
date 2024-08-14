const mongoose = require("mongoose");
const { Schema } = mongoose;

const attendanceSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    jymId: { type: String, required: true },
    mode: { type: String, enum: ["trial", "registered", "inactive"] },
    isTrial: { type: Boolean, default: false },
    trialTokenExpiry: { type: Date },
    checkIn: { type: Date, default: Date.now() },
    checkOut: { type: Date },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("attendance", attendanceSchema);

module.exports = Attendance;
