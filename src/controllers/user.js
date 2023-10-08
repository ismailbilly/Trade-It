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

const { setAsync, getAsync } = require("../repository/redisHelper");
const { getHttpStatusCodes } = require("../utils/httpErrors");



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
      //category of interest. There should be next button on frontend to category page
      //
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
    const cachedOTP = await redisClient.set(email, _otp, {EX: 60 * 1});

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
    // check if the user existance
    let user = await findQuery("Users", {
      email: email,
    });
    if (user.length === 0) {
       logger.error({
         message: `Invalid credentials. details supplied is ${JSON.stringify(
           req.body
         )}`,
         status: 422,
         method: req.method,
         url: req.originalUrl,
       });

       const err = new Error("Invalid credential");
       err.status = 400;
       return next(err);
    } else {
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
    }
   
   
  } catch (error) {
    next(error);
  }
};
const resendEmailOtp = async (req, res, next) => {

  const { email } = req.params
  const newOtp = generateOTP();
  console.log(newOtp);
  try {
    const storedOtp = await redisClient.get(email);
    if (storedOtp) {
      return res.status(200).json({
        status: true,
        message: "OTP can only be requested after 5 minutes"
      })
    } else {
      const cachedOTP = await redisClient.set(email, newOtp, { EX: 60 * 10 });

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
    }
    
  } catch (err) {
    next(err)
  }
}
  const forgotPassword = async (req, res, next) => {
    const {email} =req.params
    try {
      const user = await findQuery("Users", { email: email })
      
      if (isEmpty(user)) {
         logger.error({
           message: `Invalid credential. details supplied is ${JSON.stringify(
             req.body
           )}`,
           status: 500,
           method: req.method,
           url: req.originalUrl,
         });

         const err = new Error("Invalid credential");
         err.status = 500;
         return next(err);
      } else {
        const hashForEmailVerification = Buffer.from(email, "utf8").toString(
          "base64"
        ); 
       

        //(min * sec * millisecond) link expires in 1 hour
         //const passwordResetExpires = Date.now() + process.env.PASSWORD_RESET_EXPIRY;
       
          // console.log('====================================');
          // console.log(passwordResetExpires);
          // console.log('====================================');
        await updateOne(
          "Users",
          { email: email },
          {
            passwordResetToken: hashForEmailVerification,
           // passwordResetExpires: passwordResetExpires
          }
        )
        //send email
         const dataToBeReplaced = {
           resetPasswordlink: `${process.env.FORGOT_PASSWORD}?email=${email}&token=${hashForEmailVerification}`,
         };

         const sendMail = await readFileAndSendEmail(
           email,
           "Xwapit Reset Password",
           dataToBeReplaced,
           "forget_password"
         );
          res.status(200).json({
            status: true,
            message: "An email has been sent",
          });
      }
    } catch (err) {
      next(err)
    }
  }
const resetPassword = async (req, res, next) => {
  const { email, token } = req.query
  const { password } = req.body
  try {
    const checkIfHashMatch = await findQuery("Users", {
      passwordResetToken: token,
      //passwordResetExpires: { $gt: Date.now() },
    });
    console.log(Date.now());
    console.log(checkIfHashMatch);
    if (isEmpty(checkIfHashMatch)) {
      logger.error({
        message: `Token expired or token is incorrect. details supplied is ${JSON.stringify(
          req.body
        )}`,
        status: 500,
        method: req.method,
        url: req.originalUrl,
      });

      const err = new Error("Token expired");
      err.status = 500;
      return next(err);
    }
    const passwordHashAndSalt = await hashMyPassword(password);
    const updatePassword = await updateOne(
      "Users",
      { email: email },
      {
        password_hash: passwordHashAndSalt[1],
        password_salt: passwordHashAndSalt[0],
        passwordResetToken: undefined,
        //passwordResetExpires: undefined,
      }
    );console.log('====================================');
    console.log('I am password');
    console.log('====================================');
    console.log(updatePassword);
    if (!updatePassword) {
      logger.error({
        message: `Token expired or token is incorrect. details supplied is ${JSON.stringify(
          req.body
        )}`,
        status: 500,
        method: req.method,
        url: req.originalUrl,
      });

      const err = new Error("Token expired");
      err.status = 500;
      return next(err);
    }
    res.status(200).json({
      status: true,
      message: "Password reset successful",
    });
  } catch (err) {
    next(err)
  }
}
module.exports = {
  createUser,
  verifyEmailOtp,
  resendEmailOtp,
  forgotPassword,
  resetPassword,
};
