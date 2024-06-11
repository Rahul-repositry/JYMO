const express = require("express");
const { signin } = require("../controllers/jymoDietBackendUser.controller");
const {
  verifyUser,
  verifyJym,
  verifyOwnership,
  verifyJymoDietBackendUser,
} = require("../utils/Middleware.utils");
const {
  createJymoOrder,
  updateJymoOrder,
} = require("../controllers/jymoDiet.controller");
const router = express.Router();

router.post("/signin", signin);
router.post(
  "/createOrder",
  verifyUser,
  verifyJym,
  verifyOwnership,
  createJymoOrder
);
router.post("/updateOrder/:id", verifyJymoDietBackendUser, updateJymoOrder);
module.exports = router;
