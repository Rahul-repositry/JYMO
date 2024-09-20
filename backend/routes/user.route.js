const express = require("express");
const { verifyUser } = require("../utils/Middleware.utils");
const router = express.Router();
const {
  userData,
  updateUserEmail,
  updateUserNameAndBdate,
  updateUserPhone,
  updateUserImg,
} = require("../controllers/user.controller");

router.get("/", verifyUser, userData);
router.post("/updateuseremail", verifyUser, updateUserEmail);
router.post("/updateusernameandbday", verifyUser, updateUserNameAndBdate);
router.post("/updateuserphone", verifyUser, updateUserPhone);
router.post("/updateuserimg", verifyUser, updateUserImg);

module.exports = router;
