const { AsyncErrorHandler } = require("../utils/AsyncErrorHandler.utils.js");
const Workout = require("../models/workout.model.js");

const manageWorkoutPlan = AsyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { dayOfWeek, exercisePlan, title } = req.body;

  // Find if a workout plan exists for the user and the specified day
  const workout = await Workout.findOne({
    userId,
    dayOfWeek: dayOfWeek.toLowerCase(),
  });

  if (workout) {
    // If the workout plan exists, update it
    workout.exercisePlan = exercisePlan;
    const updatedWorkout = await workout.save();
    return res.json({
      success: true,
      message: "Workout plan updated",
      workout: updatedWorkout,
    });
  } else {
    // If the workout plan doesn't exist, create a new one
    const newWorkout = new Workout({ userId, dayOfWeek, title, exercisePlan });
    const savedWorkout = await newWorkout.save();
    return res.json({
      success: true,
      message: "Workout plan created",
      workout: savedWorkout,
    });
  }
});

const getAllWorkoutPlans = AsyncErrorHandler(async (req, res, next) => {
  const workoutPlans = await Workout.find({ userId: req.user._id });

  res.json({ success: true, workoutPlans });
});

const getWorkoutByDay = AsyncErrorHandler(async (req, res, next) => {
  const { dayOfWeek } = req.params;

  if (dayOfWeek) {
    const workoutPlans = await Workout.find({
      userId: req.user._id,
      dayOfWeek: dayOfWeek,
    });

    return res.json({
      success: true,
      workoutPlans,
      message: "Workout plan found",
    });
  }
  return next(new CustomError("Select Day to find Workout", 404));
});

module.exports = {
  manageWorkoutPlan,
  getAllWorkoutPlans,
  getWorkoutByDay,
};
