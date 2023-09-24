const Joi = require("joi");

const create = Joi.object({
  product_name: Joi.string().min(3).required().label("Product Name").messages({
    "string.empty": `"Product Name" cannot be an empty`,
    "string.min": `"Product Name" should have length of 3 characters`,
    "any.required": `"Product Name" is a required field`,
  }),
  quantity_available: Joi.string(),
  trade_preferences: Joi.string().min(3).label("Trade Preference").messages({
    "string.min": `"Trade Preference" should have length of 3 characters`,
  }),
  description: Joi.string()
    .min(20)
    .required()
    .label("Product Description")
    .messages({
      "string.empty": `"Product Description" cannot be an empty`,
      "string.min": `"Product Description" should have length of 20 characters`,
      "any.required": `"Product Description" is a required field`,
    }),
  location: Joi.string().min(3).required().label("Location").messages({
    "string.empty": `"Location" cannot be an empty`,
    "string.min": `"Location" should have length of 3 characters`,
    "any.required": `"Location" is a required field`,
  }),
  condition: Joi.string()
    .required()
    .valid("old", "new", "fairly used")
    .label("Condition")
    .messages({
      "string.empty": `"Condition" cannot be an empty`,
      "any.required": `"Condition" is a required field`,
      "any.valid": `"Condition" is not allowed`,
    }),
  additional_note: Joi.string().min(3).label("Additional note").messages({
    "string.empty": `"Additional note" cannot be an empty`,
    "string.min": `"Additional note" should have length of 3 characters`,
  }),
});
const updateProductSchema = Joi.object({
  product_name: Joi.string().min(3).label("Product Name").messages({
    "string.empty": `"Product Name" cannot be an empty`,
    "string.min": `"Product Name" should have length of 3 characters`,
  }),
  quantity_available: Joi.string(),
  trade_preferences: Joi.string().min(3).label("Trade Preference").messages({
    "string.min": `"Trade Preference" should have length of 3 characters`,
  }),
  description: Joi.string().min(20).label("Product Description").messages({
    "string.empty": `"Product Description" cannot be an empty`,
    "string.min": `"Product Description" should have length of 20 characters`,
  }),
  location: Joi.string().min(3).label("Location").messages({
    "string.empty": `"Location" cannot be an empty`,
    "string.min": `"Location" should have length of 3 characters`,
  }),
  condition: Joi.string()
    .valid("old", "new", "fairly used")
    .label("Condition")
    .messages({
      "string.empty": `"Condition" cannot be an empty`,
      "any.valid": `"Condition" is not allowed`,
    }),
  additional_note: Joi.string().min(3).label("Additional note").messages({
    "string.empty": `"Additional note" cannot be an empty`,
    "string.min": `"Additional note" should have length of 3 characters`,
  }),
});

module.exports = { create, updateProductSchema };
