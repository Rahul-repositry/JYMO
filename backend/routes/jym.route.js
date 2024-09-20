const express = require("express");
const { verifyUser } = require("../utils/Middleware.utils.js");
const router = express.Router();
const { getJym, getJymById } = require("../controllers/jym.controller.js");

router.get("/getjym/:JUID", verifyUser, getJym);
router.get("/getjymbyid/:id", verifyUser, getJymById);

module.exports = router; //export the router to use in other files
