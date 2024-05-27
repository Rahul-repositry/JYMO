const express = require("express");
const { verifyUser } = require("../utils/Middleware.utils");

const {
  createWorkoutPlan,
  deleteWorkoutPlan,
  updateWorkoutPlan,
  getAllWorkoutPlans,
} = require("../controllers/workout.controller");
const router = express.Router();

router.post("/createWorkout", verifyUser, createWorkoutPlan);
router.post("/updateWorkout", verifyUser, updateWorkoutPlan);
router.get("/getAllWorkout", verifyUser, getAllWorkoutPlans);
router.post("/deleteWorkout", verifyUser, deleteWorkoutPlan);

module.exports = router;
