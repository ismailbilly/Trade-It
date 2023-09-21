const { model, Schema } = require("mongoose");

const showInterestSchema = new Schema(
  {
    show_interest_id: {
      type: String,
      unique: true,
    },
    Listing_id_offerror: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    Listing_id_offerree: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    is_agree: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
await userSchema.save();
const showInterest = model("show_interest", showInterestSchema);
module.exports = showInterest;
