const mongoose = require("mongoose");
const { Schema } = mongoose;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const geolocationSchema = new Schema(
  {
    latitude: { type: String },
    longitude: { type: String },
  },
  { _id: false }
);

const addressLocationSchema = new Schema(
  {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
  },
  { _id: false }
);

const jymSchema = new Schema(
  {
    name: { type: String, required: true },
    recoveryEmail: { type: String, required: true },
    jymUniqueId: { type: String, unique: true, required: true }, // necesaary will identify uniquely and user for login
    password: { type: String },
    geolocation: geolocationSchema,
    addressLocation: addressLocationSchema,
    owners: [{ type: Schema.Types.ObjectId, ref: "users" }], // will get updated as new owners join and quit
    subscriptionFee: { type: String },
    subscriptionStartDate: { type: Date },
    subscriptionEndDate: { type: Date },
    resetPasswordToken: String,
    jymoDietId: { type: Schema.Types.ObjectId, ref: "jymoDietIdForJymOwners" },
    jymDietAmount: Number,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

userSchema.plugin(AutoIncrement, { inc_field: "jymUniqueId" });

const Jym = mongoose.model("jym", jymSchema);

module.exports = { Jym };
