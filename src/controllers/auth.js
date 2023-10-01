// const Users = require("../models/user")
const xwapitDB_collections = require("../repository/collections");
const { v4: uuidv4 } = require("uuid");
const successHandler = require("../utils/successResponse");
const User = require("../models/user");
const logger = require("../config/logger");
const { redisClient } = require("../config/redis");
const {
  CustomerCreated,
  resetCustomerPasswordSuccessful,
  CustomerExist,
  InvalidCredentials,
  invalidPhone,
  EmailHasNotBeenVerified,
  OtpMismatch,
  OtpResentSentSuccessfully,
  EmailVerificationSuccessful,
  LoginSuccessful,
} = require("../constants/messages");
const {
  hashPassword,
  generateOtp,
  comparePassword,
  phoneValidation,
} = require("../utils/helpers");

const { findQuery, insertOne, updateOne, findOne } = require("../repository");

const jwt = require("jsonwebtoken");
const Users = require("../models/user");
// const createUser = async(req,res,next) => {
//     const { lastname, othername, email, password } = req.body
//     try {
//          const user = await findQuery(Users, {
//            email: email,
//          });
//       if (user.length > 0) {
//         logger.error({
//           message: `Customer credentials existed. details supplied is ${JSON.stringify(
//             req.body
//           )}`,
//           status: 422,
//           method: req.method,
//           ip: req.ip,
//           url: req.originalUrl,
//         });

//         const err = new Error("User already exists");
//         err.status = 400;
//         return next(err);

//       } else {
//         const newUser = {
//           lastname,
//           othername,
//           email,
//           password,
//         };

//         await insertOne(xwapitDB_collections.users, newUser);

//             res.status(201).json({
//               status: true,
//               message: "Account created",
//               data: "Lets talk",
//             });
//          }
//     } catch (error) {
//         next(error)
//     }

// }

// module.exports = {
//     createUser
// }

const register = async (req, res, next) => {
  const { surname, othernames, email, phone_number, password } = req.body;
  try {
    const checkIfUserExist = await findOne("Users", {
      email: email,
    });

    if (checkIfUserExist) {
      logger.error({
        message: `Customer credentials existed. details supplied is ${JSON.stringify(
          req.body
        )}`,
        status: 422,
        method: req.method,
        ip: req.ip,
        url: req.originalUrl,
      });

      const err = new Error(CustomerExist);
      err.status = 400;
      return next(err);
    }
    const validatePhone = phoneValidation(phone_number);
    if (!validatePhone) {
      logger.error({
        message: `phone is not valid ${phone_number}`,
        status: 422,
        method: req.method,
        ip: req.ip,
        url: req.originalUrl,
      });

      const err = new Error(invalidPhone);
      err.status = 400;
      return next(err);
    }
    const user_id = uuidv4();
    const { hash, salt } = await hashPassword(password);
    const newUser = new User({
      user_id,
      surname,
      othernames,
      email,
      phone: phone_number,
      passwordHash: hash,
      passwordSalt: salt,
    });

    const _otp = generateOtp(6);
    console.log(_otp);
    redisClient.set(`${email}`, JSON.stringify(_otp), {
      EX: 60 * 5, //seconds
      NX: true,
    });

    const user = await insertOne(xwapitDB_collections.users, newUser);

    // readFileAndSendEmail(
    //   email,
    //   "OTP",
    //   ` Hello  ${lastname} ${othernames},\n Your OTP is ${_otp}`
    // );

    res.status(201).json({
      status: true,
      message: CustomerCreated,
      data: [],
    });
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(400).json({
    //   status: false,
    //   message: error.message,
    // });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkIfUserExist = await findOne(xwapitDB_collections.users, {
      email: email,
    });

    if (!checkIfUserExist) {
      logger.error({
        message: `user with the email not found ${email}`,
        status: 422,
        method: req.method,
        ip: req.ip,
        url: req.originalUrl,
      });

      const err = new Error(InvalidCredentials);
      err.status = 400;
      return next(err);
    }

    //check if  user is verified
    if (!checkIfUserExist.is_verified) {
      logger.error({
        message: `Email has not been verified ${checkIfUserExist.email}`,
        status: 422,
        method: req.method,
        ip: req.ip,
        url: req.originalUrl,
      });

      const err = new Error(EmailHasNotBeenVerified);
      err.status = 400;
      return next(err);
    }

    const checkPasswordMatch = await comparePassword(
      password,
      checkIfUserExist.passwordHash
    );
    if (!checkPasswordMatch) throw new Error("Incorrect Password");
    if (!checkPasswordMatch) {
      logger.error({
        message: `invalid password`,
        status: 422,
        method: req.method,
        ip: req.ip,
        url: req.originalUrl,
      });

      const err = new Error();
      err.status = 400;
      return next(err);
    }
    console.log("we are here");

    const token = await jwt.sign(
      {
        email: email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      status: true,
      message: LoginSuccessful,
      token: token,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      error: err.message,
    });
    console.log(err);
  }
};

const editUser = async (req, res) => {
  try {
    const { surname, othernames, email, phone_number } = req.body;

    const user = await Users.findByIdAndUpdate(req.params._id, {
      surname,
      othernames,
      email,
      phone_number,
    });
    await user.save();
    res.status(200).json({ status: "success", user });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const startForgetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const checkIfUserExist = await findOne(xwapitDB_collections.users, {
      email: email,
    });

    if (!checkIfUserExist) throw new Error("user not found");

    const _otp = generateOtp(6);
    console.log(_otp);
    res.status(400).json({
      status: true,
      message: "otp has been sent to your email, " || "an error occurred",
      otp: _otp,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: error.message || "an error occurred",
    });
  }
};

const completeForgotPassword = async (req, res, next) => {
  const { newPassword, email } = req.body;
  const { otp } = req.params;
  try {
    // if(otp!=process.env.OTP) throw new Error ("Invalid otp")
    //we have to verify otp
    const { hash, salt } = await hashPassword(newPassword);
    await updateOne(
      "Users",
      { email },
      {
        passwordHash: hash,
        passwordSalt: salt,
      }
    );
    res.status(400).json({
      status: true,
      message: resetCustomerPasswordSuccessful || "an error occurred",
      // otp: _otp,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: error.message || "an error occurred",
    });
  }
};
const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.params;
  try {
    const data = await redisClient.get(`${email}`);
    console.log(data);

    if (!data) {
      logger.error({
        message: `email is not valid ${email}`,
        status: 422,
        method: req.method,
        ip: req.ip,
        url: req.originalUrl,
      });

      const err = new Error(InvalidCredentials);
      err.status = 400;
      return next(err);
    }

    if (otp !== data) {
      logger.error({
        message: `otp is not valid ${otp}`,
        status: 422,
        method: req.method,
        ip: req.ip,
        url: req.originalUrl,
      });

      const err = new Error(OtpMismatch);
      err.status = 400;
      return next(err);
    }

    await updateOne(
      xwapitDB_collections.users,
      { email },
      { is_verified: true }
    );
    res.status(200).json({
      status: 200,
      message: EmailVerificationSuccessful,
      data,
    });
  } catch (error) {
    next(error);
  }
};
const resendOtp = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) throw new Error(InvalidCredentials);
    if (!email) {
      logger.error({
        message: `email is not valid ${email}`,
        status: 422,
        method: req.method,
        ip: req.ip,
        url: req.originalUrl,
      });

      const err = new Error(InvalidCredentials);
      err.status = 400;
      return next(err);
    }
    const _otp = generateOtp(6);
    console.log(_otp);
    redisClient.set(`${email}`, JSON.stringify(_otp), {
      EX: 60 * 5, //seconds
      NX: true,
    });
    res.status(200).json({
      status: 200,
      message: OtpResentSentSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  register,
  login,
  editUser,
  startForgetPassword,
  completeForgotPassword,
  verifyOtp,
  resendOtp,
};
