const express = require("express");
const router = express.Router();
const {
  startWalletFunding,
  completeWalletFunding,
} = require("../controllers/payment");
router
  .post("/start-wallet-Funding", startWalletFunding)
  .get("/complete-wallet-Funding", completeWalletFunding);
module.exports = router;
