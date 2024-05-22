const express = require("express");
const {
  signup,
  signin,
  google,
  resetPassword,
  verifyToken,
} = require("../controllers/auth.controller.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.post("/resetPassword", resetPassword);
router.post("/verifyToken", verifyToken);

module.exports = router;
