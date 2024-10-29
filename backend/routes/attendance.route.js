const express = require("express");
const router = express.Router();
const {
  verifyUser,
  verifyJym,
  verifyOwnership,
  verifyActiveUser,
} = require("../utils/Middleware.utils.js");
const {
  attendanceHandler,
  getAttendanceByDate,
  registerAgainAttendance,
  registerAttendance,
  inactiveAttendance,
  makeInactiveToActiveAttendance,
} = require("../controllers/attendance.controller.js");

/**
 * @frontend @backend
 *
 * This route facilitates the attendance registration process for gym users, integrating both frontend and backend functionalities.
 *
 * @frontend:
 * - The frontend sends a POST request to this route, typically triggered by a user action such as clicking a "Check-In" or "Check-Out" button.
 * - The request includes necessary data such as `jymId` and optionally `userId`, which are collected from the user's session or input.
 * - The frontend handles the display of success or error messages based on the response from the backend, updating the UI accordingly.
 *
 * @backend:
 * - The backend processes the incoming request, verifying the user's identity and their registration status with the gym.
 * - It manages the business logic for attendance, including handling trial periods, updating attendance records, and transitioning user statuses.
 * - The backend ensures data integrity and security, interacting with the database to store or update attendance records.
 * - It sends a response back to the frontend, indicating the success or failure of the attendance registration process.
 */
router.post("/regularattendance", verifyUser, attendanceHandler);

// this need to be changed according to new model
router.post(
  "/attendancebyadmin",
  verifyUser,
  verifyJym,
  verifyOwnership,
  attendanceHandler
);

// register again attendance by  admin
router.post(
  "/registeragain",
  verifyUser,
  verifyJym,
  verifyOwnership,
  registerAgainAttendance
);
// create register attendance by  admin
router.post(
  "/register",
  verifyUser,
  verifyJym,
  verifyOwnership,
  registerAttendance
);
// create inactive attendance by  admin for that jym
router.post(
  "/inactive",
  verifyUser,
  verifyJym,
  verifyOwnership,
  inactiveAttendance
);
// create inactive attendance by  admin for that jym
router.post(
  "/activate",
  verifyUser,
  verifyJym,
  verifyOwnership,
  makeInactiveToActiveAttendance
);

/**
 * @frontend @backend
 *
 * This route allows users to retrieve their attendance records for a specified date range at a gym.
 *
 * @frontend:
 * - The frontend sends a POST request to this route, typically triggered by a user action such as selecting a date range and clicking a "View Attendance" button.
 * - The request includes necessary data such as `jymId`, `startDate`, and `endDate`, which are collected from the user's input.
 * - The frontend handles the display of the attendance records or error messages based on the response from the backend, updating the UI accordingly.
 *
 * @backend:
 * - The backend processes the incoming request, verifying the user's identity and their association with the gym.
 * - It queries the database for attendance records that match the specified user ID, gym ID, and date range.
 * - The backend ensures data integrity and security, returning the attendance records if found.
 * - It sends a response back to the frontend, indicating the success or failure of the attendance retrieval process.
 * - If no records are found, it responds with an appropriate error message.
 */
router.post("/getattendancebydate", verifyUser, getAttendanceByDate);
router.post(
  "/getattendancebydateByAdmin",
  verifyUser,
  verifyJym,
  getAttendanceByDate
);

module.exports = router;
