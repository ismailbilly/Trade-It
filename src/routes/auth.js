const express = require("express");
const router = express.Router();
const {
  register,
  login,
  startForgetPassword,
  completeForgotPassword,
  validateLogin
} = require("../controllers/auth");
const validationMiddleware = require("../middleware/validation.js");
const authorization = require("../middleware/authorization.js");
const validationData = require("../validation/user.js");
router.post("/user", validationMiddleware(validationData.create), register);
router.post("/login",  validationMiddleware(validationData.validateLogin), login);
router.get(
  "/start-forget-password",
  validationMiddleware(validationData.validateEmail),
  startForgetPassword
);
router.patch(
  "/complete-forget-password/:otp",
  validationMiddleware(validationData.validateCompleteForgotPassword),
  completeForgotPassword
);
module.exports = router;
