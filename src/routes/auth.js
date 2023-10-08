const express = require("express");
const router = express.Router();
const login= require("../controllers/auth");
// const validationData = require("../validation/user");
// const validationMiddleware = require("../middleware/validation");

router.post("/login", login);

module.exports = router;
