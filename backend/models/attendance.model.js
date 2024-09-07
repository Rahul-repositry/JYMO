const mongoose = require("mongoose");
const { Schema } = mongoose;

const attendanceSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    jymId: { type: Schema.Types.ObjectId, required: true },
    mode: {
      type: String,
      enum: ["register", "trial", "registered", "inactive", "registerAgain"],
      /**
       * register : this will be made by gym owner for user to register into new jym
       *  How register works
       *  firstly owner will make a attendance with register mode  after that if user scans jymqr then their trial period will start
       *
       * trial : this will get automatically when user scans gym qr  only after if there is register attendance with this update userduration trialdate
       *
       * registered : this will be made after trial period ends and will be used as regular attendance
       *
       * inactive : this will be made at the time when user quits the jym with this update userduration quit date for the jym .
       *
       * registerAgain :  if user is not marking attendance regularly from past 30 days or previous attendance is inactive then owner will make initiateagain attendance and then user can mark their attendance as usual with mode registered .
       */
    },
    isTrial: { type: Boolean, default: false },
    trialTokenExpiry: { type: Date },
    checkIn: { type: Date, default: Date.now() },
    checkOut: { type: String },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("attendance", attendanceSchema);

module.exports = Attendance;
