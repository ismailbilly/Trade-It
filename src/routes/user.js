const express = require("express");
const router = express.Router();
const {
  createUser,
  verifyEmailOtp,
  resendEmailOtp,
  forgotPassword,
  resetPassword,
} = require("../controllers/user");
const validationData = require("../validation/user");
const validationMiddleware = require("../middleware/validation");

/**
 * creates a new user
 * @swagger
 * /users/create-user:
 *   post:
 *     summary: creates a new user
 *     description: This Creates a new record for the user
 *     tags:
 *       - USERS
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: lastname
 *         in: body
 *         required: true
 *       - name: othernames
 *         in: body
 *         required: true
 *       - name: email
 *         in: body
 *         required: true
 *       - name: phone_number
 *         in: body
 *         required: true
 *       - name: password
 *         in: body
 *         required: true
 *       - name: repeat_password
 *         in: body
 *         required: true
 *       - name: selected_categories
 *         in: body
 *         required: true
 *     responses:
 *        201:
 *          description: Account created.
 *        400:
 *          Unable to create account
 *        422:
 *          Bad Request
 */
router.post("/user", createUser);
router.get("/verify-email/:email/:otp", verifyEmailOtp);
router.get("/resend-email-otp/:email", resendEmailOtp);
router.get("/forgot-password/:email", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
