const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid");

const attendanceSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    gymId: { type: Schema.Types.ObjectId, ref: "jyms", required: true },
    mode: { type: String, enum: ["trial", "visit", "registered"] },
    isTrial: { type: Boolean, default: false },
    trialToken: { type: String },
    trialTokenExpiry: { type: Date },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date },
  },
  { timestamps: true }
);

attendanceSchema.pre("save", function (next) {
  if (this.isTrial && !this.trialToken) {
    this.trialToken = uuidv4();
    this.trialTokenExpiry = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // Current date + 2 days
  }
  next();
});

module.exports = mongoose.model("attendance", attendanceSchema);
