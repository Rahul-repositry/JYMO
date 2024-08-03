const mongoose = require("mongoose");
const { Schema } = mongoose;

const jymoDietOrderSchema = new Schema(
  {
    jymId: { type: Schema.Types.ObjectId, ref: "jyms" },
    jymoDietIdForJymOwners: { type: Schema.Types.ObjectId, ref: "jyms" },
    isOrderConfirmed: { type: Boolean, default: false },
    OrderConfirmedTime: { type: Date },
    payment: { type: String, enum: ["due", "paid"] },
    paymentTime: { type: Date },
    orderQuantiy: { type: Number, required: true },
    orderTotalAmount: { type: Number },
    returnedQuantity: { type: Number },
    returnedTotalAmount: { type: Number },
  },
  { timestamps: true }
);

const jymoDietOrder = mongoose.model("jymoDietOrder", jymoDietOrderSchema);

module.exports = { jymoDietOrder };
