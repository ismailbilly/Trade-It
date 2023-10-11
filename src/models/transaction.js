const { model, Schema } = require("mongoose");

const transactionSchema = new Schema(
  {
    transaction_id: {
      type: String,
      unique: true,
      required: true,
    },
    listing_id: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
    },
    user_id: {
      // user_id of the offeree
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    Listing_id_offerror: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    Listing_id_offerree: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "accepted", "declined", "rollback"],
        message: "{VALUE} is not supported",
      },
    },
  },
  { timestamps: true }
);

const Transaction = model("Transaction", transactionSchema);
module.exports = Transaction;
