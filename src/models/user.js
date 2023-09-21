const mongoose = require("mongoose");
const xwapitDB_collections = require("../repository/collections");
const UserSchema = new mongoose.Schema({
    
  lastname: {
    type: String,
    required: true,
  },
  othername: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

//const Users = mongoose.model(xwapitDB.users, UserSchema);

//module.exports = { Users };
module.exports = mongoose.model(xwapitDB_collections.users, UserSchema);
