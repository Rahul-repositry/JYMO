const express = require("express");
const {
  verifyUser,
  verifyJym,
  verifyOwnership,
} = require("../utils/Middleware.utils");
const {
  membershipHandler,
  membershipPauseHandler,
  membershipResumeHandler,
} = require("../controllers/membership.controller");
const router = express.Router();

router.post(
  "/createOrRenewMembership",
  verifyUser,
  verifyJym,
  verifyOwnership,
  membershipHandler
);
router.post(
  "/pauseMembership",
  verifyUser,
  verifyJym,
  verifyOwnership,
  membershipPauseHandler
);
router.post(
  "/createOrRenewMembership",
  verifyUser,
  verifyJym,
  verifyOwnership,
  membershipResumeHandler
);

module.exports = router;
