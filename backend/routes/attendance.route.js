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
} = require("../controllers/attendance.controller.js");

router.post("/regularattendance", verifyUser, attendanceHandler);

// this need to be changed according to new model
router.post(
  "/attendancebyadmin",
  verifyUser,
  verifyJym,
  verifyOwnership,
  verifyActiveUser,
  attendanceHandler
);

router.post("/getattendancebydate", verifyUser, getAttendanceByDate);

module.exports = router;
