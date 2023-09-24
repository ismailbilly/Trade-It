const express = require("express");
const router = express.Router();
const { createUser } = require("../controllers/auth")
const validationData = require("../validation/user")
const validationMiddleware = require("../middleware/validation")

router.post("/user", validationMiddleware(validationData.create), createUser);

module.exports = router