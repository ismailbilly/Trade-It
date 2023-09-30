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
    "/update-product/:product_id",
    validationMiddleware(validationData.updateProductSchema),
    updateProduct
  )
  .get("/get-product/:product_id", getProduct)
  .delete("/delete-product/:product_id", deleteProduct);

module.exports = router;
