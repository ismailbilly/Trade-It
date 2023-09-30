// const login= async(req, res, next) => {
//   const { email, password } = req.body;

//   try {
//     let user = await findQuery("Users", {
//       email: email,
//     });
//     //if user signed up, but did not veerify their otp, we prompt them at login
//     UserModel.findOne({ email })
//       .then((user) => {
//         bcrypt
//           .compare(password, user.password)
//           .then((passwordCheck) => {
//             if (!passwordCheck)
//               return res.status(400).send({
//                 error: "Don't have Password",
//               });

//             if (!user.isVerified) {
//               // Generate a random OTP using the otp-generator package
//               const otp = otpGenerator.generate(4, {
//                 lowerCaseAlphabets: false,
//                 upperCaseAlphabets: false,
//                 specialChars: false,
//               });

//               // Store the OTP in Redis, with the user's email as the key
//               client.set(email, otp);

//               return res.status(400).send({
//                 error:
//                   "User is not verified, please finish verification using this OTP",
//                 OTP: otp,
//               });
//             }

//             // create jwt token
//             const token = jwt.sign(
//               {
//                 userId: user._id,
//                 username: user.username,
//               },
//               process.env.JWT_SECRET,
//               { expiresIn: "24h" }
//             );

//             return res.status(200).send({
//               msg: "Login Successful...!",
//               user: user,
//               token,
//             });
//           })
//           .catch((error) => {
//             return res.status(400).send({ error: "Password does not Match" });
//           });
//       })
//       .catch((error) => {
//         return res.status(404).send({ error: "Username not Found" });
//       });
//   } catch (error) {
//     return res.status(500).send({ error });
//   }
// }
