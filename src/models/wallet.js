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
    amount_before: {
      type: Double,
      required: true,
      default: 0.00,
    },
    amount_after: {
      type: Double,
      required: true,
      default: 0.00,
    },
  },

  { timestamps: true }
);

const Wallet = model("Wallet", walletSchema);
module.exports = Wallet;
