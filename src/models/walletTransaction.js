const { model, Schema } = require("mongoose");
const mongoose = require("mongoose");
require("mongoose-double")(mongoose);

const xwapitDB_collections = require("../repository/collections");
const walletTransactionSchema = new Schema({
  wallet_transaction_id: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Schema.Types.Double,
  },
  wallet_id: {
    type: Schema.Types.ObjectId,
    ref: "Wallet",
  },
  conversion_rate: {
    type: Schema.Types.Double,
  },
  amount_of_coin: {
    type: Schema.Types.Double,
    required: true,
  },
  transaction_type: {
    type: String,
    enum: {
      values: ["credit", "debit"],
      message: "{VALUE} is not supported",
    },
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

const walletTransaction = model(
  xwapitDB_collections.walletTransaction,
  walletTransactionSchema
);

module.exports = walletTransaction;
