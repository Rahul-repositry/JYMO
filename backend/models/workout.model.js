import mongoose, { Schema } from "mongoose/lib/mongoose";

const workoutSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dayOfWeek: { type: String, required: true },
    exercisePlan: [
      {
        exercise: { type: String, required: true },
        sets: { type: Number, required: true },
        reps: { type: Number, required: true },
        duration: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("workout", workoutSchema);
