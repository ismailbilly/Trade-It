const { model, Schema } = require("mongoose");

const transactionReviewSchema = new Schema(
  {
    transaction_review_id: {
      type: String,
      required: true,
      unique: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    transaction_id: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },
    comments: {
      type: String,
      required: true,
    },
    ratings: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const TransactionReview = model("TransactionReview", transactionReviewSchema);
module.exports = TransactionReview;
