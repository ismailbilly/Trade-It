const mongoose = require("mongoose");
const xwapitDB_collections = require("../repository/collections");
const ProductCategorySchema = require('../schemas/Productcategory')
const UserSchema = new mongoose.Schema(
  {
    lastname: {
      type: String,
      required: [true, "Lastname is required"],
      trim: true,
      minLength: 3,
    },
    othernames: {
      type: String,
      required: [true, "Othername is required"],
      trim: true,
      minLength: 3,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: [true, "User with the email already exists"],
      trim: true,
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

    NIN: {
      type: String,
    },
    Address: {
      type: String,
    },
    Photo: {
      type: String,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "decide not to say"],
      },
    },
    BVN: {
      type: String,
    },
    is_BVN_Verified: {
      type: Boolean,
      default: false,
    },
    means_of_id: {
      type: String,
    },
    is_means_of_id_verifid: {
      type: Boolean,
      default: false,
    },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "xwapitDB_collections.wallet",
    },
    selectedCategories: [
      {
        type: [ProductCategorySchema],
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "xwapitDB_collections.category",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model(xwapitDB_collections.users, UserSchema);
