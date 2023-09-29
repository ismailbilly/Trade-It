const { v4: uuidv4 } = require("uuid");
const xwapitDB_collections = require("../repository/collections");
const Products = require("../models/product");
const {
  productCreated,
  productDeleted,
  productUpdated,
} = require("../constants/messages");
const { insertOne } = require("../repository");

const createProduct = async (req, res, next) => {
  const {
    product_name,
    quantity_available,
    trade_preferences,
    description,
    location,
    condition,
    additional_note,
  } = req.body;

  try {
    const newProduct = new Products({
      product_id: uuidv4(),
      user_id,
      product_name,
      quantity_available,
      trade_preferences,
      description,
      location,
      condition,
      additional_note,
    });
    await insertOne("Products", newProduct);
    res.status(201).json({
      status: true,
      message: productCreated,
      data: newProduct,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};
const updateProduct = async (req, res, next) => {
  const { user_id } = req.params;
  try {
    await Products.updateOne({ user_id }, req.body);
    res.status(200).json({
      status: true,
      message: productUpdated,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};
const getProduct = async (req, res, next) => {
  const { product_id } = req.params;
  try {
    const data = await Product.findOne({ product_id });
    res.status(200).json({
      status: true,
      message: getCategories,
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};
const deleteProduct = (req, res, next) => {
  try {
    res.status(200).json({
      status: true,
      message: productDeleted,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};
module.exports = { createProduct, updateProduct, getProduct, deleteProduct };
