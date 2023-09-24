const { v4: uuidv4 } = require("uuid");
const Category = require("../models/category");

const {
  categoryCreated,
  categoryUpdated,
  getCategoriesMessage,
  getCategoryMessage,
} = require("../constants/messages");

const createCategory = async (req, res, next) => {
  const { categoty, desciption } = req.body;
  const { user_id } = req.params;
  try {
    const newCategory = new Category({
      category_id: uuidv4(),
      user_id,
      categoty,
      desciption,
    });
    await newCategory.save();

    res.status(201).json({
      status: true,
      message: categoryCreated,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};
const updateCategory = async (req, res, next) => {
  const { user_id, category_id } = req.params;

  try {
    req.body.user_id = user_id;
    await Category.updateOne({ category_id }, req.body);
    res.status(200).json({
      status: true,
      message: categoryUpdated,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};
const getCategory = async (req, res, next) => {
  const { category_id } = req.params;
  try {
    const data = await Category.findOne({ category_id });
    res.status(200).json({
      status: true,
      message: getCategoryMessage,
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};
const getCategories = async (req, res, next) => {
  try {
    const data = await Category.find({});
    res.status(200).json({
      status: true,
      message: getCategoriesMessage,
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};
module.exports = { createCategory, updateCategory, getCategory, getCategories };
