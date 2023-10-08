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

router.post("/user", validationMiddleware(validationData.create), createUser);
router.get("/verify/:email/:otp", verifyEmailOtp);
router.get("/resend-email-otp/:email", resendEmailOtp);
router.get("/forgot-password/:email", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
