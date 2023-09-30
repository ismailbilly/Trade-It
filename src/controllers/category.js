const { v4: uuidv4 } = require("uuid");
const Category = require("../models/category");
const xwapitDB_collections = require("../repository/collections");
const {
  categoryCreated,
  categoryUpdated,
  getCategoriesMessage,
  getCategoryMessage,
} = require("../constants/messages");
const { insertOne, updateOne, find, findOne } = require("../repository/index");
const createCategory = async (req, res, next) => {
  const { category, desciption } = req.body;
  const { user_id } = req.params;
  try {
    const newCategory = new Category({
      category_id: uuidv4(),
      user_id,
      category,
      desciption,
    });

    await insertOne(xwapitDB_collections.category, newCategory);
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
  const { category_id } = req.params;

  try {
    const data = await findOne(xwapitDB_collections.category, { category_id });
    if (!data) throw new Error(`category not found`);

    await updateOne(xwapitDB_collections.category, { category_id }, req.body);
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
    const data = await findOne(xwapitDB_collections.category, { category_id });

    if (!data) throw new Error(`category not found`);
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
    const data = await find(xwapitDB_collections.category);
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
