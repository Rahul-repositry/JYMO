const mongoose = require("mongoose");
const { Schema } = mongoose;

const membershipSchema = new Schema(
  {
    jymId: { type: Schema.Types.ObjectId, ref: "jym", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    userUniqueId: { type: Number },
    amount: { type: Number },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: {
      active: {
        value: { type: Boolean, default: true }, // this will determine active or inactive user and this will be updated by corn function according to max_inactive_days  ( FOR USER STATUS)
        lastCheckIn: { type: Date, default: Date.now() }, // Date of the last check-in or attendance
      },
      // if person has not mark attendance from last  15days(process.env.days) then he inactive
    }, //at the time whten this is set to inactive then create a attendance with inactive and remove user from user currentUUids and update quitdates in userDuration
    userDuration: { type: Schema.Types.ObjectId, ref: "userDurationInJym" }, // Reference to user duration in the gym
    membershipStatus: {
      type: String,
      enum: ["ongoing", "completed"], // this  is introduced because on a large dataset it will be very time  and  operation consuming task of finding latest membership that is ongoing for the user but with this it will be easy we just have to update the last membership to "completed" at time of creating new membership .
      default: "ongoing",
    },
    /**
     * if used in future then we can thik about this
     * isPaused: { type: Boolean, default: false },
    pausedAt: [{ type: Date }], // Array of dates for pause events
    resumeAt: [{ type: Date }], // Array of dates for resume events
    */
  },
  { timestamps: true }
);

membershipSchema.index({ userId: 1, jymId: 1 });

const Membership = mongoose.model("membership", membershipSchema);

module.exports = Membership;
