const { v4: uuidv4 } = require("uuid");

const { find, updateOne, insertOne } = require("../repository/index");
const xwapitDB_collections = require("../repository/collections");

const Conversion = require("../models/conversion");
const getConversionRate = async (req, res, next) => {
  try {
    // const _conversion = await find(xwapitDB_collections.conversion);
    // console.log(_conversion[0].conversion_rate);
    const _conversion = await getConversion();
    res.status(200).json({
      status: true,
      message: _conversion,
    });
  } catch (error) {
    next(error);
  }
};

const createConversionRate = async (req, res, next) => {
  const { conversion } = req.body;
  try {
    const _conversion = await find(xwapitDB_collections.conversion);
    console.log(_conversion);
    if (_conversion.length > 1)
      throw new Error("A conversion rate already exists");
    if (!conversion) throw new Error("Please pass the conversion rate");
    const newConversionRate = new Conversion({
      conversion_rate: conversion,
      conversion_id: uuidv4(),
    });
    await insertOne(xwapitDB_collections.conversion, newConversionRate);
    res.status(200).json({
      status: true,
      message: "Conversion rate created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getConversionAmountRate = async () => {
  return conversion[0].conversion_rate;
};

const updateConversionRate = async (req, res, next) => {
  const { conversion } = req.body;
  try {
    await updateOne(xwapitDB_collections.conversion);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConversionRate,
  getConversionAmountRate,
  updateConversionRate,
  createConversionRate,
};
