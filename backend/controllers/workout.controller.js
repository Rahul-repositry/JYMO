const { AsyncErrorHandler } = require("../utils/AsyncErrorHandler.utils");
const Workout = require("../models/workout.model.js");

const createWorkoutPlan = AsyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { dayOfWeek, exercisePlan } = req.body;

  const workoutIsExists = await Workout.findOne({
    userId,
    dayOfWeek: dayOfWeek.toLowerCase(),
  });

  if (workoutIsExists) {
    return next(new CustomError("Plan already created", 409));
  }
  const workout = new Workout({ userId, dayOfWeek, exercisePlan });

  let obj = await workout.save();
  res.json({ success: "true", message: "workout plan created", obj });
});
const updateWorkoutPlan = AsyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { dayOfWeek, exercisePlan } = req.body;

  // Find the workout by ID and dayOfWeek
  const workout = await Workout.findOne({
    userId,
    dayOfWeek: dayOfWeek.toLowerCase(),
  });
  if (!workout) {
    return next(new CustomError("Workout plan not found ", 404));
  }

  // Update the workout plan
  workout.exercisePlan = exercisePlan;

  const updatedWorkout = await workout.save();
  res.json({
    success: true,
    message: "Workout plan updated",
    workout: updatedWorkout,
  });
});

const deleteWorkoutPlan = AsyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { dayOfWeek } = req.body;

  const deletedWorkout = await Workout.findOneAndDelete({
    userId,
    dayOfWeek: dayOfWeek.toLowerCase(),
  });
  if (!deletedWorkout) {
    return next(new CustomError("Workout plan not found ", 404));
  }
  res.json({ success: true, message: "Workout plan deleted" });
});

const getAllWorkoutPlans = AsyncErrorHandler(async (req, res, next) => {
  const workoutPlans = await Workout.find({ userId: req.user._id });
  res.json({ success: true, workoutPlans });
});

module.exports = {
  createWorkoutPlan,
  updateWorkoutPlan,
  getAllWorkoutPlans,
  deleteWorkoutPlan,
};
