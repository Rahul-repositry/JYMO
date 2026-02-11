const express = require("express");
const {
  jymSignup,
  jymSignin,
  logout,
  jymResetPassword,
} = require("../controllers/jymAuth.controller.js");
const { verifyUser, verifyJym } = require("../utils/Middleware.utils.js");
const router = express.Router();

router.post("/signup", verifyUser, jymSignup);
router.post("/signin", verifyUser, jymSignin);
// router.post("/forgotpassword", verifyUser, );
// router.post("/createsession", verifyUser, createForgotSession);
router.post("/resetpassword", jymResetPassword);
router.delete("/logout", verifyUser, verifyJym, logout);

module.exports = router;
