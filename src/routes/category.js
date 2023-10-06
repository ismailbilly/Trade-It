const express = require("express");
const router = express.Router();
// const {
//   register,
//   login,
//   startForgetPassword,
//   completeForgotPassword,
//   verifyOtp,
//   resendOtp,
// } = require("../controllers/auth");
const {
  getAllCategory,
  getSingle,
} = require("../controllers/categories");

router.get("/", getAllCategory);
router.get(
  "/:catgory",
  getSingle
);
module.exports = router;
