const express = require("express");
const { verifyUser, verifyJym } = require("../utils/Middleware.utils.js");
const router = express.Router();
const {
  getJym,
  getJymById,
  getDashboardStats,
} = require("../controllers/jym.controller.js");
/**
 * @route GET /getjym/:JUID
 * @frontend
 * - Sends a GET request to retrieve gym details using a unique gym identifier (JUID).
 * - Typically triggered by user actions such as selecting a gym from a list.
 * - Displays gym details or error messages based on the response.
 *
 * @backend
 * - Verifies the user's identity and authorization to access gym details.
 * - Queries the database for a gym with the specified JUID.
 * - Returns gym details if found, or an error message if the JUID is incorrect.
 */
router.get("/getjym/:JUID", verifyUser, getJym);

/**
 * @route GET /getjymbyid/:id
 *
 * @frontend
 * - Sends a GET request to retrieve gym details using the gym's database ID.
 * - Typically triggered by user actions such as selecting a gym from a list.
 * - Displays gym details or error messages based on the response.
 *
 * @backend
 * - Verifies the user's identity and authorization to access gym details.
 * - Queries the database for a gym with the specified ID.
 * - Returns gym details if found, or an error message if the ID is incorrect.
 */
router.get("/getjymbyid/:id", verifyUser, getJymById);

router.get("/getDashboardStats", verifyUser, verifyJym, getDashboardStats);

module.exports = router; //export the router to use in other files
