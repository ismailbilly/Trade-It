const { model, Schema } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const currencySchema = new Schema(
  {
    currency_pair_id: {
      type: String,
      required: true,
    },
    base_currency_name: {
      type: String,
      required: true,
    },
    target_currency_name: {
      type: String,
      required: true,
    },
    is_allowed: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const Currency = model("Currency", currencySchema);
module.exports = Currency;
