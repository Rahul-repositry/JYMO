const express = require("express");
const { verifyUser } = require("../utils/Middleware.utils");

const {
  manageWorkoutPlan,
  getWorkoutByDay,
  getAllWorkoutPlans,
} = require("../controllers/workout.controller");
const router = express.Router();

/**
 * @route POST /manageworkout
 * @frontend
 * - Sends a POST request with `dayOfWeek`, `exercisePlan`, and `title`.
 * - Displays success or error messages based on the response.
 * @backend
 * - Verifies the user's identity.
 * - Checks if a workout plan exists for the specified day and updates it, or creates a new one if it doesn't.
 * - Sends a response indicating the success or failure of the workout plan management.
 */
router.post("/manageworkout", verifyUser, manageWorkoutPlan);

/**
 * @route GET /getallworkout
 * @frontend
 * - Sends a GET request to retrieve all workout plans for the user.
 * - Displays the list of workout plans or an error message based on the response.
 * @backend
 * - Verifies the user's identity.
 * - Retrieves all workout plans associated with the user.
 * - Sends a response with the workout plans or an error message if none are found.
 */
router.get("/getallworkout", verifyUser, getAllWorkoutPlans);

/**
 * @route GET /getworkoutbyday/:dayOfWeek
 * @frontend
 * - Sends a GET request with a specific `dayOfWeek` to retrieve the workout plan for that day.
 * - Displays the workout plan or an error message based on the response.
 * @backend
 * - Verifies the user's identity.
 * - Retrieves the workout plan for the specified day of the week.
 * - Sends a response with the workout plan or an error message if not found.
 */
router.get("/getworkoutbyday/:dayOfWeek", verifyUser, getWorkoutByDay);

module.exports = router;
