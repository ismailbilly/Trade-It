const express = require("express");
const router = express.Router();
const validationMiddleware = require("../middleware/validation");
const validationData = require("../validation/category");
const {
  createCategory,
  updateCategory,
  getCategory,
  getCategories,
} = require("../controllers/category");

router
  .post(
    "/create-category",
    validationMiddleware(validationData.create),
    createCategory
  )
  .patch(
    "/update-category/:category_id",
    validationMiddleware(validationData.updateCategorySchema),
    updateCategory
  )
  .get("/get-category/:category_id", getCategory)
  .get("/get-categories", getCategories);

module.exports = router;
