const express = require("express");
const router = express.Router();
const { createCategory } = require("../controllers/category");
const validationMiddleware = require("../middleware/validation");
router.post("/category", validationMiddleware(createCategory), createCategory);
router.patch(
  "/category",
  validationMiddleware(updateCategoryInfo),
  updateCategoryInfo
);
const {
  createCategory,
  updateCategoryInfo,
} = require("../validation/category");

module.exports = router;
