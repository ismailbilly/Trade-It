const { isEmpty } = require("../utils");
const loggerMessage = require("../utils/loggerHelper");
const { findQuery } = require("../repository");
const { hashMyPassword, generateOTP } = require("../utils");
const { redisClient } = require("../config/redis");
const { readFileAndSendEmail } = require("../services/email");
const errorHandler = require("../utils/error")
const bcrypt = require('bcrypt')

const login= async(req, res, next) => {
  const { email, password } = req.body;

  try {
    let verifyUserEmail = await findQuery("Users", {
      email: email,
    });
      if (verifyUserEmail.length === 0) {
        loggerMessage("Invalid credentials", req);
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
          loggerMessage("Invalid credentials", req);

          const err = new Error("Invalid credential");
          err.status = 400;
          return next(err);
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
              email: userData.email,
              username: userData.username,
              id: userData._id,
              
            };
            jwt.sign(
              payload,
              process.env.JWT_SECRET,
              { expiresIn: process.env.JWT_EXPIRES_TIME },
              (err, token) => {
                if (err) {
                    //log the exact error in a logger
                    loggerMessage(
                      "Login Error: while trying to sign the jw",
                      req
                    );
                     const err = new Error("Invalid credential");
                     err.status = 400;
                     return next(err);
                 
                }
                
                delete payload.password_hash;
                delete payload.password_salt;
                delete payload.created_at;
                delete payload.modified_at;

                res.setHeader("authorization", token);
                res.status(200).send({
                  status: "true",
                  message: "Login successful",
               
                });
              }
            );
          }
        }
      
      }
    //if user signed up, but did not veerify their otp, we prompt them at login
    // UserModel.findOne({ email })
    //   .then((user) => {
    //     bcrypt
    //       .compare(password, user.password)
    //       .then((passwordCheck) => {
    //         if (!passwordCheck)
    //           return res.status(400).send({
    //             error: "Don't have Password",
    //           });

    //         if (!user.isVerified) {
    //           // Generate a random OTP using the otp-generator package
    //           const otp = otpGenerator.generate(4, {
    //             lowerCaseAlphabets: false,
    //             upperCaseAlphabets: false,
    //             specialChars: false,
    //           });

    //           // Store the OTP in Redis, with the user's email as the key
    //           client.set(email, otp);

    //           return res.status(400).send({
    //             error:
    //               "User is not verified, please finish verification using this OTP",
    //             OTP: otp,
    //           });
    //         }

    //         // create jwt token
    //         const token = jwt.sign(
    //           {
    //             userId: user._id,
    //             username: user.username,
    //           },
    //           process.env.JWT_SECRET,
    //           { expiresIn: "24h" }
    //         );

    //         return res.status(200).send({
    //           msg: "Login Successful...!",
    //           user: user,
    //           token,
    //         });
    //       })
    //       .catch((error) => {
    //         return res.status(400).send({ error: "Password does not Match" });
    //       });
    //   })
    //   .catch((error) => {
    //     return res.status(404).send({ error: "Username not Found" });
    //   });
  } catch (error) {
    next(error)
  }
}
module.exports = login