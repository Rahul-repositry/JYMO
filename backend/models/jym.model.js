const mongoose = require("mongoose");
const { Schema } = mongoose;

const geolocationSchema = new Schema(
  {
    latitude: { type: String },
    longitude: { type: String },
  },
  { _id: false }
);

const addressLocationSchema = new Schema({
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
});

const jymSchema = new Schema(
  {
    name: { type: String, required: true },
    recoveryEmail: { type: String, required: true },
    jymId: { type: String, unique: true, required: true },
    password: { type: String },
    geolocation: geolocationSchema,
    addressLocation: addressLocationSchema,
    owners: [{ type: Schema.Types.ObjectId, ref: "users" }], // will get updated as new owners join and quit
    activeUsers: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "users" },
        joinDates: [{ type: Date }],
      },
    ], // will get updated as new users join
    quittedUsers: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "users" },
        quitDates: [{ type: Date }],
      },
    ], // will get updated as new users quit
    numbers: [String], // will get updated as new users join and quit
    subscriptionFee: { type: Number, default: 1000 },
    subscriptionStartDate: { type: Date },
    subscriptionEndDate: { type: Date },
    isActive: { type: Boolean, default: true },
    createdDate: { type: Date, default: Date.now },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

const Jym = mongoose.model("jym", jymSchema);

module.exports = { Jym };
