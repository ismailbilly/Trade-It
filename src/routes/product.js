const express = require("express");
const validationMiddleware = require("../middleware/validation");
const validationData = require("../validation/product");
const router = express.Router();
const {
  createProduct,
  updateProduct,
  getProduct,
  deleteProduct,
} = require("../controllers/product");

router
  .post(
    "/create-product",
    validationMiddleware(validationData.create),
    createProduct
  )
  .patch(
    "/update-product",
    validationMiddleware(validationData(updateCategorySchema)),
    updateProduct
  )
  .get("/get-product", getProduct)
  .delete("/delete-product", deleteProduct);

module.exports = router;
