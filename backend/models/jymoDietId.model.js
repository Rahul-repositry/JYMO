const mongoose = require("mongoose");
const { Schema } = mongoose;

const jymoDietIdForJymOwnersSchema = new Schema(
  {
    jymId: { type: Schema.Types.ObjectId, ref: "jyms" }, // after this create save this id to jym.jymoDietId
  },
  { timestamps: true }
);
const jymoDietIdForJymOwners = mongoose.model(
  "jymoDietIdForJymOwners",
  jymoDietIdForJymOwnersSchema
);

module.exports = { jymoDietIdForJymOwners };
