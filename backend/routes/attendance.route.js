const express = require("express");
const router = express.Router();
const { verifyUser } = require("../utils/Middleware.utils.js");
const {
  attendanceHandler,
} = require("../controllers/attendance.controller.js");

router.post("/regularAttendance", verifyUser, attendanceHandler);

module.exports = router;
