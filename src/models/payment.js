const { model, Schema } = require("mongoose");

const paymentSchema = new Schema(
  {
    payment_id: {
      type: String,
      required: true,
    },
    payment_refence: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Payment = model("Payment", paymentSchema);
module.exports = Payment;
