const express = require("express");
const { verifyUser } = require("../utils/Middleware.utils");

const {
  manageWorkoutPlan,
  getWorkoutByDay,
  getAllWorkoutPlans,
} = require("../controllers/workout.controller");
const router = express.Router();

router.post("/manageworkout", verifyUser, manageWorkoutPlan);
router.get("/getallworkout", verifyUser, getAllWorkoutPlans);
router.get("/getworkoutbyday/:dayOfWeek", verifyUser, getWorkoutByDay);

module.exports = router;
