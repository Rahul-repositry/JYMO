const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
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

module.exports = mongoose.model("payment", paymentSchema);
