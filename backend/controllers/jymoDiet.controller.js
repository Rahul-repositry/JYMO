const { jymoDietOrder } = require("../models/jymoDietOrder.model.js");
const CustomError = require("../utils/CustomError.utils.js");
const { Jym } = require("../models/jym.model.js");
const { AsyncErrorHandler } = require("../utils/AsyncErrorHandler.utils.js");

// Handler for creating a new jymoDietOrder
const createJymoOrder = AsyncErrorHandler(async (req, res, next) => {
  const { orderQuantity } = req.body;

  if (!req.jym) {
    return next(new CustomError("Jym not found", 404));
  }

  const {
    _id: jymId,
    jymoDietId: jymoDietIdForJymOwners,
    jymDietAmount,
  } = req.jym;
  const orderTotalAmount = orderQuantity * jymDietAmount;

  const newOrder = new jymoDietOrder({
    jymId,
    jymoDietIdForJymOwners,
    orderQuantity,
    orderTotalAmount,
  });

  const savedOrder = await newOrder.save();
  res.status(201).json(savedOrder);
});

// Handler for updating an existing jymoDietOrder
const updateJymoOrder = AsyncErrorHandler(async (req, res, next) => {
  const orderId = req.params.id;
  const { returnedQuantity, payment } = req.body; // you need to send returnquantity everytime from frontend when update required for order.

  const jym = req.jym;
  if (!jym) {
    return next(new CustomError("Jym not found", 404));
  }

  const currentDate = new Date();

  // Initialize fields to update
  const updateFields = {
    isConfirmed: true,
    confirmedTime: currentDate.toISOString(),
    payment: payment,
    returnedQuantity: returnedQuantity || null,
    returnedTotalAmount: returnedQuantity
      ? returnedQuantity * jym.jymDietAmount
      : null,
  };

  // Conditionally add paymentTime if payment is "paid"
  if (payment === "paid") {
    updateFields.paymentTime = currentDate.toISOString();
  }

  const updatedOrder = await jymoDietOrder.findByIdAndUpdate(
    orderId,
    updateFields,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedOrder) {
    return next(new CustomError("Order not found", 404));
  }

  res
    .status(200)
    .json({ success: true, message: "Order updated", updatedOrder });
});

module.exports = {
  createJymoOrder,
  updateJymoOrder,
};
