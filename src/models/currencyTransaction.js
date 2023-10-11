const { model, Schema } = require("mongoose");

const currancyTransactionSchema = new Schema(
  {
    currency_transaction_id: {
      type: String,
      required: true,
    },
    currency_pair_id: {
      type: String,
      required: true,
    },
    Currency_instant_request: {
      type: String,
      required: true,
    },
    payment_ref: {
      type: String,
      required: true,
    },
    Agreed_rate: {
      type: String,
      required: true,
    },
    creditor_name: {
      type: String,
      required: true,
    },
    creditor_account_number: {
      type: String,
      required: true,
      trim: true,
    },
    creditor_bank: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "successful", "failed", "rollback"],
        message: "{VALUE} is not supported",
      },
    },
  },
  { timestamps: true }
);

const currencyTransaction = model(
  "currencyTransaction",
  currancyTransactionSchema
);
module.exports = currencyTransaction;
