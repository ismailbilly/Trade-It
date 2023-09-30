const { v4: uuidv4 } = require("uuid");
const Category = require("../models/category");
const xwapitDB_collections = require("../repository/collections");
const {
  categoryCreated,
  categoryUpdated,
  getCategoriesMessage,
  getCategoryMessage,
  categoryNotFound,
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
    next(error);
  }
};
const updateCategory = async (req, res, next) => {
  const { category_id } = req.params;

  try {
    const data = await findOne(xwapitDB_collections.category, { category_id });
    if (!data) throw new Error(categoryNotFound);

    await updateOne(xwapitDB_collections.category, { category_id }, req.body);
    res.status(200).json({
      status: true,
      message: categoryUpdated,
    });
  } catch (error) {
    next(error);
  }
};
const getCategory = async (req, res, next) => {
  const { category_id } = req.params;
  try {
    const data = await findOne(xwapitDB_collections.category, { category_id });

    if (!data) throw new Error(categoryNotFound);
    res.status(200).json({
      status: true,
      message: getCategoryMessage,
      data,
    });
  } catch (error) {
    next(error);
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
    next(error);
  }
};
module.exports = { createCategory, updateCategory, getCategory, getCategories };
