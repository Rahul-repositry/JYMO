const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    transactionId: { type: String, required: true },
    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      required: true,
    },
    gateway: { type: String, enum: ["Paytm", "Razorpay"], required: true },
  },
  { timestamps: true }
);

paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ userId: 1 });

module.exports = mongoose.model("payment", paymentSchema);
