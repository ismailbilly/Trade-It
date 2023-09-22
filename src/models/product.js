const { Schema, model } = require("mongoose");
const productSchema = new Schema({
  product_id: {
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
  quantity_available: {
    type: Number,
  },
  trade_preferences: {
    type: String,
  },
  Description: {
    type: String,
    required: [true, "description for the item to be listed is required"],
  },
  location: {
    type: String,
    required: [true, "location of the user listing the item is required"],
  },
  condition: {
    type: String,
    enum: {
      values: ["new", "old", "fairly used"],
      message: "{VALUE} is not supported",
    },
  },
  Images: {
    type: String,
  },
  approval_status: {
    type: String,
    enum: {
      values: ["approved", "declined", "pending"],
      message: "{VALUE} is not supported",
    },
  },
  additional_note: {
    type: String,
  },
});
const Product = model("Product", productSchema);
module.exports = Product;
