//const Users = require("../models/user");
//const xwapitDB_collections = require("../repository/collections");
//const successHandler = require("../utils/successResponse");
const {
  hashMyPassword,
  generateReferralCode,
  generateOTP,
} = require("../utils");
const bcrypt = require("bcrypt");
const logger = require("../config/logger");
const {readFileAndSendEmail} = require('../services/email')
const { redisClient } = require("../config/redis");
const { findQuery, insertOne, updateOne } = require("../repository");
const { log } = require("handlebars/runtime");
const { isEmpty } = require("../utils");


const { getHttpStatusCodes } = require("../utils/httpErrors");
const {
  setValue,
  getValue,
  deleteValue,
  incrementValue,
  ttl,
} = require("../repository/redisHelper");


const createUser = async (req, res, next) => {
  const { lastname, othernames, email, password, phone_number } = req.body;
  try {
   
      
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

      if (isEmpty(user)) {
        logger.error({
          message: `Unable to create account. details supplied is ${JSON.stringify(
            req.body
          )}`,
          status: 500,
          method: req.method,
          url: req.originalUrl,
        });

        const err = new Error("Unable to create account");
        err.status = 500;
        return next(err);
      }
    //generate OTP
    const _otp = generateOTP();
   
    //Save to redis
    const cachedOTP = await redisClient.set(email, _otp, {EX: 60 * 100});

    if (cachedOTP != "OK") {
      logger.error({
        message: `Unable to create account. details supplied is ${JSON.stringify(
          req.body
        )}`,
        status: 500,
        method: req.method,
        url: req.originalUrl,
      });

      const err = new Error("Unable to create account");
      err.status = 500;
      return next(err);
    }
    //Send Email
    
    // const dataToBeReplaced = {
    //   fullname: `${lastname} ${othernames}`,
    //   otp: _otp,
      
    // };
    
    // const sendMail = await readFileAndSendEmail(
    //   email,
    //   "Confirm your Xwapit account",
    //   dataToBeReplaced,
    //   "otp"
    // );
    res.status(201).json({
      status: true,
      message: "Account created",
    });
     }
  } catch (error) {
    next(error);
  }
};

//verify/:email/:otp
const verifyEmailOtp = async (req, res, next) => {
  const { email, otp } = req.params;
  try {
    // check the user existance
    // let exist = await UserModel.findOne({ username: username });
    // if (!exist) return res.status(404).send({ error: "Can't find User!" });

    //Get OTP From Redis
    const storedOtp = await redisClient.get(email);
  
    if (storedOtp === otp) {
      
      //update userDB
      await updateOne("Users", { email: email }, { is_email_verified: true });
      redisClient.del(email);
      res.status(200).json({
        status: true,
        message: "Account verification successful",
      });
    } else {
      // If the OTPs do not match, send an error response
      logger.error({
        message: `Unable to verify email. details supplied is ${JSON.stringify(
          req.params
        )}`,
        status: 500,
        method: req.method,
        url: req.originalUrl,
      });

      const err = new Error("Unable to verify account");
      err.status = 500;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};
const resendEmailOtp = async (req, res, next) => {

  const { email } = req.params
  const newOtp = generateOTP();

  try {
    const cachedOTP = await redisClient.set(email, newOtp, { EX: 60 * 100 });

    if (cachedOTP != "OK") {
      logger.error({
        message: `Unable to create account. details supplied is ${JSON.stringify(
          req.body
        )}`,
        status: 500,
        method: req.method,
        url: req.originalUrl,
      });

      const err = new Error("Unable to create account");
      err.status = 500;
      return next(err);
    }
    //Send Email

    const dataToBeReplaced = {
      fullname: `${lastname} ${othernames}`,
      otp: newOtp,
    };

    const sendMail = await readFileAndSendEmail(
      email,
      " Xwapit OTP Resend",
      dataToBeReplaced,
      "otp"
    );
   

    res.status(200).send({
      status: true,
      message: "otp resent to email",
    });
  } catch (e) {
    next(error)
  }
}
module.exports = {
  createUser,
  verifyEmailOtp,
  resendEmailOtp,
};
