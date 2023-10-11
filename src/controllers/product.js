const { v4: uuidv4 } = require("uuid");
const xwapitDB_collections = require("../repository/collections");
const Products = require("../models/product");
const {
  productCreated,
  productDeleted,
  productUpdated,
  getProductMessage,
  productNotFound,
} = require("../constants/messages");
const { insertOne, findOne, updateOne } = require("../repository");

const createProduct = async (req, res, next) => {
  const { user_id } = req.params;
  const {
    product_name,
    quantity_available,
    trade_preferences,
    description,
    location,
    condition,
    additional_note,
    images,
  } = req.body;

  try {
    const newProduct = new Products({
      product_id: uuidv4(),
      user_id: "",
      product_name,
      quantity_available,
      trade_preferences,
      description,
      location,
      condition,
      additional_note,
      images,
    });
    await insertOne(xwapitDB_collections.products, newProduct);
    res.status(201).json({
      status: true,
      message: productCreated,
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
};
const updateProduct = async (req, res, next) => {
  const { product_id } = req.params;
  try {
    const data = await findOne(xwapitDB_collections.products, { product_id });
    if (!data) throw new Error(productNotFound);

    await updateOne(xwapitDB_collections.products, { product_id }, req.body);
    res.status(200).json({
      status: true,
      message: productUpdated,
    });
  } catch (error) {
    next(error);
  }
};
const getProduct = async (req, res, next) => {
  const { product_id } = req.params;
  try {
    const data = await findOne(xwapitDB_collections.products, { product_id });
    if (!data) throw new Error(productNotFound);
    res.status(200).json({
      status: true,
      message: getProductMessage,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};
const deleteProduct = async (req, res, next) => {
  const { product_id } = req.params;
  try {
    await updateOne("Products", { product_id }, { is_deleted: true });
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