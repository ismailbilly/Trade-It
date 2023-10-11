const { Schema, model } = require("mongoose");
const xwapitDB_collections = require("../repository/collections");
const productSchema = new Schema(
  {
    // user_id: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Users",
    // },
    product_name: {
      type: String,
      required: [true, "product name for the item to be listed is required"],
    },
    quantity_available: {
      type: Number,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "xwapitDB_collections.category",
      required: true,
    },
    trade_preferences: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "description for the item to be listed is required"],
    },
    location: {
      type: String,
      required: [true, "location of the user listing the item is required"],
    },
    condition: {
      type: String,
      // required: [true, "please select the condition of the item"],
      // enum: {
      //   values: ["new", "old", "fairly used"],
      //   message: "{VALUE} is not supported",
      // },
    },
    images: {
      type: Array,
      required: true,
    },
    // price: {
    //   type: String,
    //   required: true,
    // },
    approval_status: {
      type: String,
      default: "pending",
      enum: {
        values: ["approved", "declined", "pending"],
        message: "{VALUE} is not supported",
      },
    },
    additional_note: {
      type: String,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = model("Products", productSchema);
module.exports = Product;
