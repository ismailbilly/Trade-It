const express = require("express");
const router = express.Router();
const { faker } = require("@faker-js/faker");
const Product = require("../../models/product")
const Category = require("../../models/category");
const { insertOne } = require('../../repository')


router.get("/seeder", async function (req, res, next) {
  const categories = [
    "Baby",
    "Movies",
    "Shoes",
    "Books",
    "Electronics",
    "Computers",
    "Kids",
    ];
    try {
        for (let i = 0; i < 20; i++) {
    let product = new Product({
      product_name: faker.commerce.productName(),
      location: faker.location.country(),
      category: categories[Math.floor(Math.random() * categories.length)],
      description: faker.lorem.paragraph(),
      image: ["https://images-na.ssl-images-amazon.com/images/I/4196ru-rkjL.jpg"],
    });

    const saveProduct = await insertOne("Product", product);
  }
  for (let i = 0; i < categories.length; i++) {
    let cat = new Category({
      category_name: categories[i],
    });
    await insertOne("Category", cat);
  }
  res.send('done');
}
     catch (error) {
        next(error)
    }
}) 

module.exports = router;
