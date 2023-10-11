const mongoose = require("mongoose")

const ProductCategorySchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      required: true,
    },
    // subcategory: {
    //   type: String,
    //   //required: true
    // },
   
  },
  // { timestamps: true }
);
module.exports = ProductCategorySchema;