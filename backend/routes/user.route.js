const express = require("express");
const { verifyUser } = require("../utils/Middleware.utils");
const router = express.Router();
const { userData } = require("../controllers/user.controller");

router.get("/", verifyUser, userData);

module.exports = router;
