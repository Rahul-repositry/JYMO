const mongoose = require("mongoose");
const { Schema } = mongoose;

const workoutSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    dayOfWeek: { type: String, required: true },
    title: {
      type: String,
    },
    exercisePlan: [
      {
        exercise: { type: String, required: true },
        sets: { type: Number },
        reps: { type: Number },
        duration: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

workoutSchema.pre("save", function (next) {
  this.dayOfWeek = this.dayOfWeek.toLowerCase();

  next();
});

const Workout = mongoose.model("workout", workoutSchema);
module.exports = Workout;
