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

const waitListSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    category: {
      type: String,
      enum: ["waitList"], // Define allowed values explicitly
      required: true,
    },
  },
  { timestamps: true }
);

waitListSchema.index({ userId: 1 });

const waitList = mongoose.model("waitlist", waitListSchema);

module.exports = { waitList };
