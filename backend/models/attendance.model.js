const mongoose = require("mongoose");
const { Schema } = mongoose;

const attendanceSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    gymId: { type: Schema.Types.ObjectId, ref: "jyms", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("attendance", attendanceSchema);
