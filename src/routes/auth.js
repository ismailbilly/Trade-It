const express = require("express");
const router = express.Router();
const {
  createUser,
  verifyEmailOtp,
  resendEmailOtp,
} = require("../controllers/user");
const validationData = require("../validation/user");
const validationMiddleware = require("../middleware/validation");

router.post("/user", validationMiddleware(validationData.create), createUser);
router.get("/verify/:email/:otp", verifyEmailOtp);
router.post("/resend-email-otp/:email", resendEmailOtp);

module.exports = router;
