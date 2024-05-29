const mongoose = require("mongoose");
const { Schema } = mongoose;

const membershipSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    amount: { type: Number, default: 800 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: { type: String, enum: ["active", "paused"], default: "active" },
    gateway: { type: String, enum: ["Paytm", "Razorpay"], required: true },
    transactionId: { type: String, required: true },
    isPaused: { type: Boolean, default: false }, // return error if enddate passed
    pausedAt: { type: Date }, // return error if enddate passed
    totalPausedDuration: { type: Number, default: 0 }, // in milliseconds
  },
  { timestamps: true }
);

membershipSchema.pre("save", function (next) {
  const currentDate = new Date();
  this.endDate = new Date(currentDate.getTime() + 29 * 24 * 60 * 60 * 1000); // 30 days later (one right now)
  next();
});

membershipSchema.methods.pause = function () {
  if (!this.isPaused) {
    this.isPaused = true;
    this.pausedAt = new Date();
    this.status = "paused";
  }
};

// Instance method to resume membership
membershipSchema.methods.resume = function () {
  if (this.isPaused) {
    const endDate = this.endDate;
    const now = new Date();
    const pausedDuration = endDate - this.pausedAt;
    this.totalPausedDuration = pausedDuration;
    this.endDate = new Date(now.getTime() + pausedDuration);
    this.isPaused = false;
    this.pausedAt = null;
    this.status = "active";
  }
};

module.exports = mongoose.model("membership", membershipSchema);
