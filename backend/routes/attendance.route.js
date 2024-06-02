const express = require("express");
const router = express.Router();
const {
  verifyUser,
  verifyJym,
  verifyOwnershipAndActiveUser,
} = require("../utils/Middleware.utils.js");
const {
  attendanceHandler,
} = require("../controllers/attendance.controller.js");

router.post("/regularAttendance", verifyUser, attendanceHandler);
router.post(
  "/attendanceByAdmin",
  verifyUser,
  verifyJym,
  verifyOwnershipAndActiveUser,
  attendanceHandler
);

module.exports = router;
