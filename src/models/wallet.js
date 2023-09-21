const { model, Schema } = require("mongoose");

const walletSchema = new Schema(
  {
    wallet_id: {
      type: String,
      required: true,
      unique: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    account_id: {
      // where is this accountid coming from?
      type: String,
      required: true,
      unique: true,
    },
    account_balance: {
      type: Number,
      required: true,
      default: 0,
    },
  },

  { timestamps: true }
);

const Wallet = model("Wallet", walletSchema);
module.exports = Wallet;
