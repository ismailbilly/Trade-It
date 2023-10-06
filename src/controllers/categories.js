const { find } = require("../repository");

const getAllCategory = async (req, res, next) => {
  try {
    const cats = await find("Categories");

    res.status(200).json({
      status: "success",
      data: cats,
    });
  } catch (error) {
    throw new Error("Error getting all categories");
  }
};

const getSingle = async (req, res, next) => {
  try {
    const cat = await findOne("Categories", { id: req.body.id });

    res.status(200).json({
      status: "success",
      data: cat,
    });
  } catch (error) {
    throw new Error("Error getting all categories");
  }
};
module.exports ={getAllCategory, getSingle}