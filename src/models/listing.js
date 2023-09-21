const { Schema, model } = require("mongoose");
const listingSchema = new Schema({
  listing_id: {
    type: String,
    unique: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  product_name: {
    type: String,
    required: [true, "product name for the item to be listed is required"],
  },
  Description: {
    type: String,
    required: [true, "description for the item to be listed is required"],
  },
  location: {
    type: String,
    required: [true, "location of the user listing the item is required"],
  },
  Images: {},
  approval_status: {
    type: String,
    enum: {
      values: ["approved", "declined", "pending"],
      message: "{VALUE} is not supported",
    },
  },
});
const Listing = model("Listing", listingSchema);
module.exports = Listing;
