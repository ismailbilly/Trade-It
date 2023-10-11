const mongoose = require("mongoose");
const xwapitDB_collections = require("../repository/collections");

const walletSchema = new mongoose.Schema(
  {
    // wallet_id: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    // user_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "xwapitDB_collections.user",
    //   required: true,
    // },
    // amount_before: {
    //   type: Double,
    //   required: true,
    //   default: 0.0,
    // },
    // amount_after: {
    //   type: Double,
    //   required: true,
    //   default: 0.0,
    // },
    balance: {
      type: Number,
      default: 0,
      // default: {
      //   amount: 0,
      //   currency: "NGN",
      // },
    },
    coins: {
      type: Number,
      default: 0,
    },
  }

  // { timestamps: true }
);

const Wallet = mongoose.model(xwapitDB_collections.wallet, walletSchema);
module.exports = Wallet;
