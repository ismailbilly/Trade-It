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
 *     description: This Creates a new record for the user which also creates the wallet, save any transaction to the db
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
 *        500:
 *          Unable to setup wallet
 *        422:
 *          User already exists
 */
router.post("/user", createUser);

/**
 * verify user
 * @swagger
 * /verify-email/{email}/{otp}:
 *   get:
 *     summary: Verify  the email
 *     description: This verifies the email and set the status of is_email_verified in the user to true.
 *     tags:
 *       - USERS
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *       - name: otp
 *         in: path
 *         required: true
 *     responses:
 *        200:
 *          description: Account verification successful.
 *        400:
 *          Unable to verify  user
 *        422:
 *          Bad Request
 */
router.get("/verify-email/:email/:otp", verifyEmailOtp);

/**
 * Resend OTP to user's email address
 * @swagger
 * /resend-email-otp/{email}:
 *   get:
 *     summary: Resend OTP to user's email address
 *     description: This endpoint sends OTP to user's email address
 *     tags:
 *       - USERS
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *     responses:
 *        200:
 *          description: otp resent to email.
 *        500:
 *          OTP can only be requested after 5 minutes
 *        422:
 *          Bad Request
 */
router.get("/resend-email-otp/:email", resendEmailOtp);

/**
 * start forget password
 * @swagger
 * /forgot-password/{email}:
 *   get:
 *     summary: Send otp to email address if exists
 *     description: This sends otp to email address if exists to be used in reset password
 *     tags:
 *       - USERS
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *     responses:
 *        200:
 *          description: An email has been sent.
 *        500:
 *          Invalid credential
 *        422:
 *          Bad Request
 */
router.get("/forgot-password/:email", forgotPassword);
/**
 * reset password
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Reset the password to new password in the request body.
 *     description: takes the email and token in the parameter and updates the password.
 *     tags:
 *       - USERS
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         in: query
 *         required: true
 *       - name: token
 *         in: query
 *         required: true
 *       - name: password
 *         in: body
 *         required: true
 *     responses:
 *        200:
 *          description: Password reset successful.
 *        500:
 *          Token expired
 *        422:
 *          Bad Request
 */
router.post("/reset-password", resetPassword);

module.exports = router;
