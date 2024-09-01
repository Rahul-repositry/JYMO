const express = require("express");
const {
  jymSignup,
  jymSignin,
  jymId,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controllers/jymAuth.controller.js");
const { verifyUser, verifyJym } = require("../utils/Middleware.utils.js");
const router = express.Router();

router.post("/signup", verifyUser, jymSignup);
router.post("/signin", verifyUser, jymSignin);
router.post("/jymId", verifyUser, jymId);
router.post("/forgotpassword", verifyUser, forgotPassword);
router.post("/resetpassword", verifyUser, resetPassword);
router.post("/logout", verifyUser, verifyJym, logout);

module.exports = router;
