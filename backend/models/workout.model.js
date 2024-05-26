const mongoose = require("mongoose");
const { Schema } = mongoose;

const workoutSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
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

const Workout = mongoose.model("workout", workoutSchema);
module.exports = Workout;
