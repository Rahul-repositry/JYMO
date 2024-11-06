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
        value: { type: Boolean, default: true }, // If true, membership is active (there will be automatic func that will run at midnight and turns every bson's this value false if user lastCheckIn value is not updated from last)
        lastCheckIn: { type: Date, default: Date.now() }, // Date of the last check-in or attendance
      },
      // if person has not mark attendance from last  15days(process.env.days) then he inactive
    }, //at the time whten this is set to inactive then create a attendance with inactive and remove user from user currentUUids and update quitdates in userDuration
    userDuration: { type: Schema.Types.ObjectId, ref: "userDurationInJym" }, // Reference to user duration in the gym

    /**
     * if used in future then we can thik about this
     * isPaused: { type: Boolean, default: false },
    pausedAt: [{ type: Date }], // Array of dates for pause events
    resumeAt: [{ type: Date }], // Array of dates for resume events
    */
  },
  { timestamps: true }
);

// write now it is getting  automatically according MAXABSENTDAYS(env variable) but if in future we can use pause and resume this will be our reference for that there waas a status paused in membership so add paused in status if you want to use this funconality

// membershipSchema.methods.pause = function () {
//   if (!this.isPaused) {
//     let date = new Date();
//     this.isPaused = true;
//     this.pausedAt.push(date.toISOString()); // Add the current pause date to the array
//     this.status = "paused";
//   }
// };

// membershipSchema.methods.resume = function () {
//   if (this.isPaused) {
//     const now = new Date();
//     const lastPausedDate = new Date(this.pausedAt[this.pausedAt.length - 1]); // Get the last paused date
//     const pausedDuration = now.getTime() - lastPausedDate.getTime();
//     this.endDate = new Date(this.endDate.getTime() + pausedDuration);
//     this.isPaused = false;
//     this.resumeAt.push(now.toISOString()); // Add the current resume date to the array
//     this.status = "active";
//   }
// };

const Membership = mongoose.model("membership", membershipSchema);

module.exports = Membership;
