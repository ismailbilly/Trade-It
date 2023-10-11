const mongoose = require("mongoose");
const xwapitDB_collections = require("../repository/collections");
const UserSchema = new mongoose.Schema({
  lastname: {
    type: String,
    required: true,
  },
  othernames: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password_hash: {
    type: String,
    required: true,
  },
  password_salt: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  referral_code: {
    type: String,
    unique: true,
  },
  is_email_verified: {
    type: Boolean,
    default: false,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  timestamps: true,
  // passwordResetExpires: {
  //   type: Date,
  //   default: Date.now,
  //   expires: 3600, // this is the expiry time
  // },
});

git pul
module.exports = mongoose.model("Users", UserSchema);
