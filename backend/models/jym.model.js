const mongoose = require("mongoose");
const { Schema } = mongoose;

const gymSchema = new Schema(
  {
    name: { type: String, required: true },
    uniqueJymId: { type: String, required: true, unique: true },
    password: { type: String },
    location: { type: String, required: true },
    owners: [{ type: Schema.Types.ObjectId, ref: "User" }],
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    subscriptionFee: { type: Number, default: 800 },
    subscriptionStartDate: { type: Date },
    subscriptionEndDate: { type: Date },
    isActive: { type: Boolean, default: true },
    createdDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("jym", gymSchema);
