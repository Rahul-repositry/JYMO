const mongoose = require("mongoose");
const { Schema } = mongoose;

const membershipSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    amount: { type: Number },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: { type: String, enum: ["active", "paused"], default: "active" },
    isPaused: { type: Boolean, default: false },
    pausedAt: { type: Date },
  },
  { timestamps: true }
);

membershipSchema.pre("save", function (next) {
  if (!this.endDate) {
    const currentDate = new Date();
    this.endDate = new Date(currentDate.getTime() + 29 * 24 * 60 * 60 * 1000); // 30 days later
  }
  next();
});

// Static method to create or renew membership
membershipSchema.statics.createOrRenewMembership = async function (
  userId,
  amount,
  month
) {
  const currentDate = new Date();
  const latestMembership = await this.findOne({ userId })
    .sort({ endDate: -1 })
    .exec();

  let startDate = currentDate;
  if (latestMembership && currentDate > latestMembership.endDate) {
    const gapDays = Math.floor(
      (currentDate - latestMembership.endDate) / (24 * 60 * 60 * 1000)
    );
    if (gapDays > 0) {
      startDate = new Date(
        currentDate.getTime() - gapDays * 24 * 60 * 60 * 1000
      );
    }
  }

  const newMembership = new this({
    userId,
    amount,
    startDate,
    endDate: new Date(startDate.getTime() + month * 29 * 24 * 60 * 60 * 1000), // 30 days duration
  });

  await newMembership.save();
  return newMembership;
};
membershipSchema.methods.pause = function () {
  if (!this.isPaused) {
    this.isPaused = true;
    this.pausedAt = new Date();
    this.status = "paused";
  }
};

membershipSchema.methods.resume = function () {
  if (this.isPaused) {
    const now = new Date();
    const pausedDuration = now.getTime() - this.pausedAt.getTime();
    this.endDate = new Date(this.endDate.getTime() + pausedDuration);
    this.isPaused = false;
    this.pausedAt = null;
    this.status = "active";
  }
};

module.exports = mongoose.model("membership", membershipSchema);
