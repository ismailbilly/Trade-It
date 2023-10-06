const express = require("express");
const router = express.Router();

const {
  getConversionRate,
  updateConversionRate,
  createConversionRate,
} = require("../controllers/conversion");

router
  .post("/create-conversion-rate", createConversionRate)
  .get("/get-conversion-rate", getConversionRate)
  .patch("/update-conversion-rate", updateConversionRate);

module.exports = router;
