const express = require("express");
const { verifyUser, verifyJym } = require("../utils/Middleware.utils.js");
const router = express.Router();
const {
  getJym,
  getJymById,
  getDashboardStats,
  checkJymsCount,
  joinWaitlist,
  jymDetails,
  getUsersByStatus,
  getUserBySearch,
  editJymDetails,
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

/// @des chq for waitlist
router.get("/count", verifyUser, checkJymsCount);

/// @des register for waitlist
router.get("/register/waitlist", verifyUser, joinWaitlist);

// @des this will fetch details for jym owner and send jymdetails to use in localstorage
router.get("/gymdetails", verifyUser, verifyJym, jymDetails);

// @des this will edit details for jym  and send jymdetails to use in localstorage
router.put("/editgymdetails", verifyUser, verifyJym, editJymDetails);

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

router.get("/getdashboardstats", verifyUser, verifyJym, getDashboardStats);

/** this willl get status on the bassis of statuses like active inactive and others  */
router.get("/getuserbystatus", verifyUser, verifyJym, getUsersByStatus);

router.get("/getuserbysearch/:userId", verifyUser, verifyJym, getUserBySearch);

module.exports = router; //export the router to use in other files
