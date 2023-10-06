const { model, Schema } = require("mongoose");
const mongoose = require("mongoose");
require("mongoose-double")(mongoose);

const xwapitDB_collections = require("../repository/collections");
const conversionSchema = new Schema({
  converion_id: {
    type: String,
    required: true,
  },
  conversion_rate: {
    type: Schema.Types.Double,
    required: true,
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

const Conversion = model(xwapitDB_collections.conversion, conversionSchema);
module.exports = Conversion;
