const express = require("express");
const router = express.Router();
const {
  register,
  login,
  startForgetPassword,
  completeForgotPassword,
} = require("../controllers/auth");
const validationMiddleware = require("../middleware/validation.js");
const authorization = require("../middleware/authorization.js");
const validationData = require("../validation/user.js");
router.post("/user", validationMiddleware(validationData.create), register);
router.get("/", authorization, login);
router.get(
  "/start-forget-password",
  validationMiddleware(validationData.validateEmail),
  startForgetPassword
);
router.patch(
  "complete-forget-password",
  validationMiddleware(validationData.validateCompleteForgotPassword),
  completeForgotPassword
);
module.exports = router;
