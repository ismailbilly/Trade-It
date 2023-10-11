const { model, Schema } = require("mongoose");

const categorySchema = new Schema({
  category_id: {
    type: String,
    unique: true,
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category_name: {
    type: String,
    unique: [true, "This category name already exists"],
    required: [true, "This field is required"],
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: [true, "Description for this category is required"],
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

const category = model("Category", categorySchema);
module.exports = category;
