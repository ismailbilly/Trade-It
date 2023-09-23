const express = require("express");
const router = express.Router();
const {register, login} = require("../controllers/auth")
const validationMiddleware = require("../middleware/validation.js")
const authorization = require("../middleware/authorization.js")
const validationData= require("../validation/user.js")
router.post('/user',  validationMiddleware(validationData.create),register)
router.get( "/", authorization,login)

module.exports = router