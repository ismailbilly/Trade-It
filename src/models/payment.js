const { model, Schema } = require("mongoose");
const mongoose = require("mongoose");
require("mongoose-double")(mongoose);
const xwapitDB_collections = require("../repository/collections");
const paymentSchema = new Schema({
  payment_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  amount: {
    type: Schema.Types.Double,
    required: true,
    default: 0.0,
  },
  payment_reference: {
    type: String,
    required: true,
  },
  payment_status: {
    type: String,
    default: "pending",
    enum: {
      values: ["pending", "fufilled"],
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

const Payment = model(xwapitDB_collections.payment, paymentSchema);
module.exports = Payment;
