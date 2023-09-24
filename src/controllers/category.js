const { validateCreateCategory } = require("../validation/category");
const Categories = require("../models/category");

const createCategory = async (req, res, next) => {
  const {
    category_name,
    category_id,
    category_description,
    admin_id,
    // IsAdmin, [not sure the validation necessary for admin]
  } = req.body;

  try {
    const { error } = validateCreateCategory(req.body);
    if (error != undefined) throw new Error(error.details[0].message);

    const checkIfcategoryExists = await Categories.findQuery({
      $or: [
        { category_id: category_id },
        { category_name: category_name },
        { category_description: category_description },
      ],
    });
    if (checkIfcategoryExists.length > 0) {
      logger.error({
        message: `Category credentials existed. details supplied is ${JSON.stringify(
          req.body
        )}`,
        status: 422,
        method: req.method,
        ip: req.ip,
        url: req.originalUrl,
      });

      const err = new Error("Category already exists");
      err.status = 400;
      return next(err);
    } else {
      const newCategory = {
        category_name,
        category_id,
        category_description,
      };

      await insertOne(xwapitDB_collections.category, newCategory);

      res.status(201).json({
        status: true,
        message: "Category created",
        data: "Ready for product listings",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  createCategory,
};

// Validate the category data
const validateCategory = (categoryData) => {
  return categorySchema.validate(categoryData);
};

const { error, value } = validateCategory(categoryData);

if (error) {
  console.log("Validation error:", error.details[0].message);
} else {
  console.log("Valid category data:", value);
}
