// const Users = require("../models/user")
//const xwapitDB_collections = require("../repository/collections");
const successHandler = require("../utils/successResponse");

const logger = require("../config/logger");
const { CustomerCreated } = require("../constants/messages");
const {
  hashPassword,
  generateOtp,
  comparePassword,
  phoneValidation,
} = require("../utils/helpers");
const { findQuery, insertOne } = require("../repository");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
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

const register = async (req, res) => {
  const { surname, othernames, email, phone, password } = req.body;
  try {
    const checkIfUserExist = await findQuery("Users", {
      email: email,
    });
    if (checkIfUserExist > 0) throw new Error(CustomerExist);

    const user_id = uuidv4();
    const { hash, salt } = await hashPassword(password);
    const newUser = {
      user_id,
      surname,
      othernames,
      email,
      phone,
      passwordHash: hash,
      passwordSalt: salt,
    };

    const _otp = generateOtp();
    const otpModel = {
      email: createUser.email,
      otp: _otp,
    };
    redisClient.set(`${createUser.email}`, JSON.stringify(_otp), {
      EX: 60 * 3, //seconds
      //NX: true,
    });
    await insertOne("otps", otpModel);

    readFileAndSendEmail(
      email,
      "OTP",
      ` Hello  ${lastname} ${othernames},\n Your OTP is ${_otp}`
    );

    res.status(201).json({
      status: true,
      message: "Account created",
      data: [],
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkEmail = await Users.findOne({ email: email });
    if (checkEmail == null) throw new Error("Invalid Credentials");

    //compare password
    const checkPasswordMatch = await comparePassword(
      password,
      checkEmail.passwordHash
    );
    if (!checkPasswordMatch) {
      throw new Error("Incorrect Password");
    }

    // using jwt to generate token
    const token = jwt.sign(
      {
        id: uuidv4,
        email: checkEmail.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      token: token,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      error: err.message,
    });
    console.log(login);
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
module.exports = { register, login, editUser };
