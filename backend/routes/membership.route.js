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
  createMembership,
  markTrialAttendance,
  isMember,
  renewMembership,
  getMembership,
  getAllMembership,
} = require("../controllers/membership.controller");
const router = express.Router();

/**
 * @route POST /createmembership
 * @frontend
 * - Accessed from the sidebar or after evaluation from '/ismember/:id'.
 * - Navigates to the createmembership page in React with userId in the URL.
 * - Provides two options: Start a trial period or Create Membership.
 * - Collects important details like amount and months.
 * - Sends a request to the backend with these details and userId in the body.
 *
 * @backend
 * - Verifies user, gym, and ownership.
 * - Creates a membership with the provided details.
 */
router.post(
  "/createmembership",
  verifyUser,
  verifyJym,
  verifyOwnership,
  createMembership
);

/**
 * @route POST /renewmembership
 * @frontend
 * - Initiated through the owner dashboard by scanning the user's QR code.
 * - Sends a request with user details to renew membership.
 *
 * @backend
 * - Verifies user, gym, and ownership.
 * - Renews the user's membership by calculating new end dates and updating records.
 */
router.post(
  "/renewmembership",
  verifyUser,
  verifyJym,
  verifyOwnership,
  renewMembership
);

/**
 * @route GET /ismember/:id
 * @frontend
 * - Scans user QR through the owner dashboard.
 * - Checks if the user is a new member or has an existing membership.
 *
 * @backend
 * - Verifies user, gym, and ownership.
 * - Determines if the user is a new member or has an existing membership.
 */
router.get("/ismember/:id", verifyUser, verifyJym, verifyOwnership, isMember);

/**
 * @route GET /getallmembership
 * @frontend
 * - Fetches all memberships for the user.
 *
 * @backend
 * - Retrieves all memberships associated with the user.
 */
router.get("/getallmembership", verifyUser, getAllMembership);

/**
 * @route GET /getmembership/:jymid
 * @frontend
 * - Retrieves membership details using userId and jymId.
 *
 * @backend
 * - Fetches the latest membership for the user in the specified gym.
 */
router.get("/getmembership/:jymid", verifyUser, getMembership);

module.exports = router;
