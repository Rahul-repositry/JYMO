const mongoose = require("mongoose");
const { Schema } = mongoose;

const subscriptionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, default: 800 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: { type: String, enum: ["active", "cancelled"], default: "active" },
    gateway: { type: String, enum: ["Paytm", "Razorpay"], required: true },
    transactionId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("subscription", subscriptionSchema);
