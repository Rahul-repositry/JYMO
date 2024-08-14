const express = require("express");
const { verifyUser } = require("../utils/Middleware.utils");

const {
  createWorkoutPlan,
  deleteWorkoutPlan,
  updateWorkoutPlan,
  getAllWorkoutPlans,
} = require("../controllers/workout.controller");
const router = express.Router();

router.post("/createworkout", verifyUser, createWorkoutPlan);
router.post("/updateworkout", verifyUser, updateWorkoutPlan);
router.get("/getallworkout", verifyUser, getAllWorkoutPlans);
router.post("/deleteworkout", verifyUser, deleteWorkoutPlan);

module.exports = router;
