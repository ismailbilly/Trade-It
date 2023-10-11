const mongoose= require("mongoose");
const xwapitDB_collections = require("../repository/collections");
const categorySchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
      //required: true
    },
    // category_name: {
    //   type: String,
    //   unique: [true, "This category name already exists"],
    //   required: [true, "This field is required"],
    // },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const category = mongoose.model(xwapitDB_collections.category, categorySchema);
module.exports = category;
