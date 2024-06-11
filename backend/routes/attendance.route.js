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
} = require("../controllers/attendance.controller.js");

router.post("/regularAttendance", verifyUser, attendanceHandler);
router.post(
  "/attendanceByAdmin",
  verifyUser,
  verifyJym,
  verifyOwnership,
  verifyActiveUser,
  attendanceHandler
);

module.exports = router;
