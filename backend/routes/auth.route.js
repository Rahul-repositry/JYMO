const express = require("express");
const {
  signup,
  signin,
  google,
  resetPassword,
  sendOtp,
  forgotPassword,
  logout,
  verifyOtp,
  deleteObject,
  putObject,
} = require("../controllers/auth.controller.js");
const { verifyUser } = require("../utils/Middleware.utils.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.post("/getputurltoken", putObject);
router.post("/deleteurltoken/:key", deleteObject);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/resetpassword", resetPassword);
router.post("/forgotpassword", forgotPassword);

router.post("/logout", verifyUser, logout);

module.exports = router;
