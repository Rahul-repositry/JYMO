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
    Country: { type: String },
  },
  { _id: false }
);

const jymSchema = new Schema(
  {
    name: { type: String, required: true },
    recoveryNumber: { type: String },
    jymUniqueId: {
      type: Number,
    },
    password: { type: String },
    geolocation: geolocationSchema,
    addressLocation: addressLocationSchema,
    owners: [{ type: Schema.Types.ObjectId, ref: "users" }],
    phoneNumbers: [
      {
        type: String,
        min: [10, "Not a valid Indian Number"],
        max: [10, "Not a valid Indian number"],
      },
    ],
    img: {
      type: String,
      default: "https://jymo.s3.ap-south-1.amazonaws.com/icon.png",
    },
    subscriptionFee: { type: String },
    subscriptionStartDate: { type: Date },
    subscriptionEndDate: { type: Date },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

jymSchema.plugin(AutoIncrement, { inc_field: "jymUniqueId", start_seq: 1 });

jymSchema.index({ jymUniqueId: 1 });

const Jym = mongoose.model("jym", jymSchema);

module.exports = Jym;
