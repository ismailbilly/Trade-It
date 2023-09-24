const Joi = require("joi");

// Validation schema for category creation by Admin only

const validateCreateCategory = (categoryData) => {
  const createCategorySchema = Joi.object({
    category_name: Joi.string().required(),
    category_id: Joi.string().required(),
    category_description: Joi.string().required(),
    user_is_active: Joi.boolean().default(true),
    admin_id: Joi.string().required(),
    // IsAdmin: Joi.boolean().valid(true).required(),
    // The full structure admin model is yet to take shape.
  });
  return createCategorySchema.validate(categoryData);
};
const updateCategoryInfo = Joi.object({
  category_name: Joi.string().required(),
  category_id: Joi.string().required(),
  category_description: Joi.string().required(),
});

module.exports = {
  validateCreateCategory,
  updateCategoryInfo,
};
