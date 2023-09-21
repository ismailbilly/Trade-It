//const Users = require("../models/user")
const xwapitDB_collections = require("../repository/collections");
const successHandler = require("../utils/successResponse");
const bcrypt = require("bcrypt")
const logger = require("../config/logger")
const {findQuery, insertOne} = require("../repository");

const createUser = async(req,res,next) => {
    const { lastname, othername, email, password } = req.body
    try {
         const user = await findQuery(xwapitDB_collections.users, {
           email: email,
         });
      if (user.length > 0) {
        logger.error({
          message: `Customer credentials existed. details supplied is ${JSON.stringify(
            req.body
          )}`,
          status: 422,
          method: req.method,
          ip: req.ip,
          url: req.originalUrl,
        });
           
        const err = new Error("User already exists");
        err.status = 400;
        return next(err);
           
      } else {
        const newUser = {
          lastname,
          othername,
          email,
          password,
        };

        await insertOne(xwapitDB_collections.users, newUser);
      
         
            
            res.status(201).json({
              status: true,
              message: "Account created",
              data: "Lets talk",
            });
         }
    } catch (error) {
        next(error)
    }
   

}

module.exports = {
    createUser
}