const mongoose = require("mongoose");
const { Schema } = mongoose;

// if person changes jym a new userDurationInJym will changed
/**
 # wht we can do this schema 

   * used for finding quitted jym or current jym for user 
        - quitted jym :- search query in which userId  is given isquitted is true
        - current jym :- search query in which is active is true and userId 
    
    * user for jyms for active , trial , quitted users 
 */

const userDurationInJymSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    jymid: { type: Schema.Types.ObjectId, ref: "jyms" },
    isQuitted: { type: Boolean, default: false }, // person if quits this jym (this.jymId) set to true
    isTrialUser: { type: Boolean, default: false }, // for new gymee  set to true by owner
    isBecomeActiveUser: { type: Boolean, default: false }, // after trial period if he comes again then it will be considered as active user and this property will be set to true
    joinDates: [Date], // a person in its cycle joins same jym multiple times and quits it therefore it is array
    quitDates: [Date],
    trialJoinDate: [Date],
  },
  { timestamps: true }
);

const UserDurationInJym = mongoose.model(
  "userdurationinjym",
  userDurationInJymSchema
);

module.exports = { UserDurationInJym };
