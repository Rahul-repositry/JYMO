const mongoose = require("mongoose");
const { Schema } = mongoose;

const checkInSummarySchema = new Schema(
  {
    jymId: { type: Schema.Types.ObjectId, ref: "jyms" },
    checkInArr: [
      {
        date: { type: Date, required: true }, // Date of the summary
        totalCheckIns: { type: Number, required: true }, // Total number of check-ins on that day
      },
    ],
  },
  { timestamps: true }
);

const CheckInSummary = mongoose.model("checkInSummary", checkInSummarySchema);

module.exports = CheckInSummary;
