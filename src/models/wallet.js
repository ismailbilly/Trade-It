const { model, Schema } = require("mongoose");
const xwapitDB_collections = require("../repository/collections");
const walletSchema = new Schema({
  wallet_id: {
    type: String,
    required: true,
    unique: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  amount_before: {
    type: Double,
    required: true,
    default: 0.0,
  },
  amount_after: {
    type: Double,
    required: true,
    default: 0.0,
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

const Wallet = model(xwapitDB_collections.wallet, walletSchema);
module.exports = Wallet;
