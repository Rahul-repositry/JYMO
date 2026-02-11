const express = require("express");
const {
  signup,
  signin,
  google,
  resetPassword,
  logout,
  deleteObject,
  putObject,
} = require("../controllers/auth.controller.js");
const { verifyUser } = require("../utils/Middleware.utils.js");

const router = express.Router();
/**
 * @route POST /signup
 * @frontend
 * - Sends a POST request with user details including `username`, `age`, `firebaseEmailIdToken`, `password`, `phoneNumber`, `birthday`, `img`, `role`, `otpObj`, and `gender`.
 * - Handles user input validation and displays success or error messages based on the response.
 * @backend
 * - Verifies the Firebase email ID token and OTP.
 * - Creates a new user in the database with the provided details.
 * - Sends a response indicating the success or failure of the signup process.
 */
router.post("/signup", signup);

/**
 * @route POST /login
 * @frontend
 * - Sends a POST request with `password` and `numberOrGmail`.
 * - Displays success or error messages based on the response.
 * @backend
 * - Identifies the user by email or phone number.
 * - Verifies the password and generates a JWT token.
 * - Sends a response with the token and user details if successful.
 */
router.post("/login", signin);

/**
 * @route POST /googles
 * @frontend
 * - Sends a POST request with the Google ID token.
 * - Displays success or error messages based on the response.
 * @backend
 * - Verifies the Google ID token.
 * - Checks if the user exists in the database.
 * - Generates a JWT token and sends it to the client if the user is registered.
 */
router.post("/google", google);

/**
 * @route POST /getputurltoken
 * @frontend
 * - Sends a POST request to obtain a signed URL for uploading images.
 * - Uses the URL to upload images directly to S3.
 * @backend
 * - Generates a signed URL for S3 object upload.
 * - Sends the URL back to the frontend.
 */
router.post("/getputurltoken", putObject);

/**
 * @route DELETE /deleteimg
 * @frontend
 * - Sends a DELETE request with the image URL to be deleted.
 * - Displays success or error messages based on the response.
 * @backend
 * - Verifies the user's authorization to delete the image.
 * - Deletes the image from S3 and updates the user's image field in the database.
 */
router.delete("/deleteimg", verifyUser, deleteObject);

/**
 * @route POST /send-otp
 * @frontend
 * - Sends a POST request with the user's phone number.
 * - Displays success or error messages based on the response.
 * @backend
 * - Generates an OTP and sends it to the user's phone number.
 * - Stores the OTP in the database.
 */
// router.post("/send-otp", sendOtp);

/**
 * @route POST /verify-otp
 * @frontend
 * - Sends a POST request with `phoneNumber`, `otp`, and `_id`.
 * - Displays success or error messages based on the response.
 * @backend
 * - Verifies the OTP against the stored value in the database.
 * - Sends a response indicating the success or failure of the verification.
 */
// router.post("/verify-otp", verifyOtp);

// router.post("/createsession", createForgotSession);

/**
 * @route POST /resetpassword
 * @frontend
 * - Sends a POST request with `token` and `newPassword`.
 * - Displays success or error messages based on the response.
 * @backend
 * - Verifies the reset token and updates the user's password.
 * - Sends a response indicating the success of the password reset.
 */
router.post("/resetpassword", resetPassword);

/**
 * Currently email is not primarly using
 *
 * @route POST /forgotpassword
 * @frontend
 * - Sends a POST request with the user's email.
 * - Displays success or error messages based on the response.
 * @backend
 * - Generates a reset token and sends a password reset email to the user.
 * - Sends a response indicating that reset instructions have been sent.
 */
// router.post("/forgotpassword", forgotPassword);

/**
 * @route GET /logout
 * @frontend
 * - Sends a GET request to log out the user.
 * - Clears the user's session or token from the client-side.
 * @backend
 * - Clears the authentication token from the server-side.
 * - Sends a response indicating successful logout.
 */
router.get("/logout", verifyUser, logout);

module.exports = router;
