const mongoose = require("mongoose");
const { Schema } = mongoose;

// if person changes jym a new userDurationInJym will changed
const userDurationInJymSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users" },
  jymid: { type: Schema.Types.ObjectId, ref: "jyms" },
  isActive: { type: Boolean, default: false }, // person who makes attenace after its trialtoken expiry will be considered as active
  isQuitted: { type: Boolean, default: false }, // person if quits this jym (this.jymId) set to true
  isTrialUser: { type: Boolean, default: false }, // for new gymee  set to true by owner
  isBecomeActiveUser: { type: Boolean, default: false }, // after trial period if he comes again then it will be considered as active user and this property will be set to true
  joinDates: [Date], // a person in its cycle joins same jym multiple times and quits it therefore it is array
  quitDates: [Date],
  trialJoinDate: [Date],
});

const UserDurationInJym = mongoose.model(
  "userdurationinjym",
  userDurationInJymSchema
);

module.exports = { UserDurationInJym };
