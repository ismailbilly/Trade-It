const { isEmpty } = require("../utils");
const loggerErrorMessage = require("../utils/loggerHelper");
const errorHandler = require("../utils/error");
const { findQuery } = require("../repository");
const { hashMyPassword, generateOTP } = require("../utils");
const { redisClient } = require("../config/redis");
const { readFileAndSendEmail } = require("../services/email");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const login= async(req, res, next) => {
  const { email, password } = req.body;

  try {
    let verifyUserEmail = await findQuery("Users", {
      email: email,
    });
      if (verifyUserEmail.length === 0) {
        loggerErrorMessage("Invalid credentials", req);
        // const err = new Error("Invalid credential");
        // err.status = 400;
        // return next(err);
        return next(errorHandler(400, "Invalid credential"));
      } else {
        //compare password
         const userData = verifyUserEmail[0];
        const isPasswordValid = await bcrypt.compare(
          password,
          userData.password_hash
        );
        if (!isPasswordValid) {
          loggerErrorMessage("Invalid credentials", req);
           return next(errorHandler(400, "Invalid credential"));
         
        } else {
          // Checking If user has verified email, if not, generate OTP and send them a mail
          if (!userData.is_email_verified) {
            //generate OTP
            const _otp = generateOTP();

            //Save to redis
            const cachedOTP = await redisClient.set(email, _otp, {
              EX: 60 * 1,
            });

            if (cachedOTP != "OK") {
              loggerErrorMessage("Unable to create account", req);
               return next(errorHandler(400, "Unable to create account"));
            }
            //Send Email

            const dataToBeReplaced = {
              //fullname: `${lastname} ${othernames}`,
              otp: _otp,
            };

            const sendMail = await readFileAndSendEmail(
              email,
              "Confirm your Xwapit account",
              dataToBeReplaced,
              "otp"
              );
               res.status(201).json({
                 status: true,
                 message: "OTP has been sent to email",
               });
          } else {
            const payload = {
              id: userData._id,
              email: userData.email,
              username: userData.username,
              selectedCategories: userData.selectedCategories
            };
            jwt.sign(
              payload,
              process.env.JWT_SECRET,
              { expiresIn: process.env.JWT_EXPIRES_TIME },
              (err, token) => {
                if (err) {
                    //log the exact error in a logger
                    loggerMessage(
                      "Login Error: while trying to sign the jwt",
                      req
                  );
                  return next(errorHandler(400, "Invalid credential"));
                 
                 
                }
                const {password_hash, password_salt,created_at, modified_at, ...restData} = userData
               
                  console.log(token);
                res.setHeader("authorization", token);
                res.status(200).send({
                  status: "true",
                  message: "Login successful",
                  data: restData
               
                });
              }
            );
          }
        }
      
      }
   
  } catch (error) {
    next(error)
  }
}
module.exports = login