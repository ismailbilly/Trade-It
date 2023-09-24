//const Users = require("../models/user");
//const xwapitDB_collections = require("../repository/collections");
//const successHandler = require("../utils/successResponse");
const { hashMyPassword, generateReferralCode } = require("../utils");
const bcrypt = require("bcrypt");
const logger = require("../config/logger");
const { findQuery, insertOne } = require("../repository");

const createUser = async (req, res, next) => {
  const { lastname, othernames, email, password, phone_number } = req.body;
  try {
    
    console.log(generateReferralCode(4));
    
    let user = await findQuery("Users", {
      email: email,
    });
    if (user.length > 0) {
      logger.error({
        message: `Customer credentials existed. details supplied is ${JSON.stringify(
          req.body
        )}`,
        status: 422,
        method: req.method,
        url: req.originalUrl,
      });

      const err = new Error("User already exists");
      err.status = 400;
      return next(err);
    } else {
      const passwordHashAndSalt = await hashMyPassword(password);
      const newUser = {
        lastname,
        othernames,
        email,
        phone_number,
        password_hash: passwordHashAndSalt[1],
        password_salt: passwordHashAndSalt[0],
        referrer_code: generateReferralCode(4),
      };

      user = await insertOne("Users", newUser);
      console.log(user);

      res.status(201).json({
        status: true,
        message: "Account created",
        data: "Lets talk",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
};
