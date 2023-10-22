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
const {
  insertOne,
  updateOne,
  find,
  findOne,
  insertMany,
} = require("../repository/index");
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
const createCategoryDescription = async (req, res, next) => {
  try {
    const categoryDescriptions = [
      {
        category: "Smart Phone and tablet",
        description: [
          "brand",
          "Storage capacity",
          "RAM",
          "version",
          "connectivity options",
        ],
      },
      {
        category: "Computers and Laptops",
        description: [
          "brand",
          "Storage capacity",
          "RAM",
          "operating system",
          "battery health",
        ],
      },
      {
        category: "Television and monitors",
        description: [
          "speed",
          "Screen size and resolution",
          "connectivity options",
          "supported technologies",
        ],
      },
      {
        category: "Home Appliances",
        description: ["brand", "size", "energy rating"],
      },
      {
        category: "Wearables",
        description: [
          "brand",
          "Supported features",
          "compatibility with other devices",
        ],
      },
      {
        category: "Baby Clothing",
        description: ["Size", "material type"],
      },
      {
        category: "Toys",
        description: ["Material", "battery required"],
      },
      {
        category: "Bath and Skin Care",
        description: [
          "Product type",
          "Quantity or size",
          "suitbale age range",
          "expiration date",
        ],
      },
      {
        category: "Makeup",
        description: ["Product type", "color", "Finish", "longetiviety claim"],
      },
      {
        category: "Haircare",
        description: ["Product type", "hair type"],
      },
      {
        category: "Fragrance",
        description: ["scent profile", "Concentration"],
      },
      {
        category: "Skin care",
        description: ["scent profile", "Concentration", "cerification"],
      },
      {
        category: "Nail care",
        description: ["scent profile", "shade", "finish"],
      },
      {
        category: "Bikes",
        description: ["brand", "gear setup ", "wheel size", "special feature"],
      },
      {
        category: "Top ",
        description: ["size", "material ", "color", "sleeve length"],
      },
      {
        category: "Bottoms ",
        description: [
          "size",
          "material ",
          "color",
          "waist measurement",
          "Type",
        ],
      },
      {
        category: "Dresses & Jumpsuits ",
        description: ["Length", "material ", "color"],
      },
      {
        category: "Shoes ",
        description: ["Size", "Gender ", "Material", "type"],
      },
      {
        category: "Handbag and wallet",
        description: ["Size", "Material"],
      },
      {
        category: "Jewelry",
        description: ["type", "Material", "Dimension"],
      },
      {
        category: "Hats and caps",
        description: ["Material", "Color"],
      },
      {
        category: "Watches",
        description: ["Material", "Brand", "feature"],
      },
      {
        category: "Sunglasses and Eyewear",
        description: [" frame Material", "lens material", "color"],
      },
      {
        category: "Seating Furniture ",
        description: [" type", " material", "color", "seating capacity"],
      },
      {
        category: "Tables ",
        description: [" type", " material", "color", "seating capacity"],
      },
      {
        category: "Storage Furniture",
        description: [" type", " material", "number of shelves"],
      },
      {
        category: "Beds & Mattresses",
        description: [" mattress type", " material", "Dimensions"],
      },
      {
        category: " Kitchen Appliances",
        description: [" Type", " brand", "Energy rating"],
      },
      {
        category: " Laundry Appliances",
        description: [" Type", " brand", "Energy rating"],
      },
      {
        category: " Office Furniture",
        description: [" Type", " material", "Feaurures"],
      },
      {
        category: "Cars",
        description: [
          " brand",
          " engine type",
          "color",
          "fuel type",
          "Transmission type",
        ],
      },
      {
        category: "Trucks & Commercial Vehicles",
        description: [" model", " engine type", "year", "fuel type"],
      },
      {
        category: "Trailers",
        description: [
          " Type",
          " engine type",
          "hitch type",
          "fuel type",
          "Axle configuration",
        ],
      },
    ];
    await insertMany(
      xwapitDB_collections.categoryDescription,
      categoryDescriptions
    );

    res.status(200).json({
      status: true,
      message: "Category  Description seeded successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports = {
  createCategory, //post
  updateCategory, //patch
  getCategory, //get, params(category_id)
  getCategories, //get
  createCategoryDescription, // post
};
