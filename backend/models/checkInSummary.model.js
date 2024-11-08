const mongoose = require("mongoose");
const { Schema } = mongoose;

const checkInSummarySchema = new Schema(
  {
    jymId: { type: Schema.Types.ObjectId, ref: "jyms" },
    checkInArr: [
      {
        date: { type: Date, required: true }, // Date of the check-in
        totalCheckIns: { type: Number, required: true }, // Total check-ins for that day
      },
    ],
    startOfWeek: { type: Date, required: true }, // Start of the week (Monday)
  },
  { timestamps: true }
);

const CheckInSummary = mongoose.model("checkInSummary", checkInSummarySchema);

module.exports = CheckInSummary;
