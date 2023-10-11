const Joi = require("joi");

const create = Joi.object({
  category_name: Joi.string()
    .min(3)
    .required()
    .label("Category Name")
    .messages({
      "string.empty": `"Category Name" cannot be an empty`,
      "string.min": `"Category Name" should have length of 3 characters`,
      "any.required": `"Category Name" is a required field`,
    }),
  description: Joi.string()
    .min(20)
    .required()
    .label("Category Description")
    .messages({
      "string.empty": `"Category Description" cannot be an empty`,
      "string.min": `"Category Description" should have length of 20 characters`,
      "any.required": `"Category Description" is a required field`,
    }),
});
const updateCategorySchema = Joi.object({
  category: Joi.string().min(3).label("Category Name").messages({
    "string.empty": `"Category Name" cannot be an empty`,
    "string.min": `"Category Name" should have length of 3 characters`,
  }),
  description: Joi.string().min(20).label("Category Description").messages({
    "string.empty": `"Category Description" cannot be an empty`,
    "string.min": `"Category Description" should have length of 20 characters`,
  }),
});
module.exports = { create, updateCategorySchema };
