const { model, Schema } = require("mongoose");

const categoryInterestSchema = new Schema(
  {
    category_interest_id: {
      type: String,
      unique: true,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    prefence: {},
  },
  { timestamps: true }
);

const categoryInterest = model("category_interest", categoryInterestSchema);
module.exports = categoryInterest;
