const express = require("express");
const {
  signup,
  signin,
  google,
  resetPassword,
  verifyToken,
  forgotPassword,
  logout,
} = require("../controllers/auth.controller.js");
const { verifyUser } = require("../utils/Middleware.utils.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.post("/resetPassword", resetPassword);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyToken", verifyToken);
router.post("/logout", verifyUser, logout);

module.exports = router;
