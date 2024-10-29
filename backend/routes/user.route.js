const express = require("express");
const { verifyUser, verifyJym } = require("../utils/Middleware.utils");
const router = express.Router();
const {
  userData,
  updateUserEmail,
  updateUserNameAndBdate,
  updateUserPhone,
  updateUserImg,
  userDataById,
  userDataByUserUniqueId,
} = require("../controllers/user.controller");

/**
 * @route GET /
 * @frontend
 * - Sends a GET request to retrieve user data.
 * - Displays user information on the profile page.
 * @backend
 * - Verifies the user's identity.
 * - Returns the user's data from the database.
 */
router.get("/", verifyUser, userData);
router.get("/userId/:userId", verifyUser, verifyJym, userDataById);
router.get(
  "/userUniqueId/:userUniqueId",
  verifyUser,
  verifyJym,
  userDataByUserUniqueId
);

/**
 * @route POST /updateuseremail
 * @frontend
 * - Sends a POST request with `firebaseEmailIdToken`.
 * - Displays success or error messages based on the response.
 * @backend
 * - Verifies the Firebase email ID token.
 * - Updates the user's email in the database.
 * - Ensures updates respect cooldown periods.
 */
router.post("/updateuseremail", verifyUser, updateUserEmail);

/**
 * @route POST /updateusernameandbday
 * @frontend
 * - Sends a POST request with `name` and `birthday`.
 * - Displays success or error messages based on the response.
 * @backend
 * - Updates the user's name and birthday in the database.
 * - Ensures updates respect cooldown periods.
 */
router.post("/updateusernameandbday", verifyUser, updateUserNameAndBdate);

/**
 * @route POST /updateuserphone
 * @frontend
 * - Sends a POST request with `phoneNumber`, `otp`, and `idToken`.
 * - Displays success or error messages based on the response.
 * @backend
 * - Verifies the OTP.
 * - Updates the user's phone number in the database.
 * - Ensures updates respect cooldown periods.
 */
router.post("/updateuserphone", verifyUser, updateUserPhone);

/**
 * @route POST /updateuserimg
 * @frontend
 * - Sends a POST request with `imgKey`.
 * - Displays success or error messages based on the response.
 * @backend
 * - Updates the user's profile image in the database.
 * - Ensures updates respect cooldown periods.
 */
router.post("/updateuserimg", verifyUser, updateUserImg);

module.exports = router;
