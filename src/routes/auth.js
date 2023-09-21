const express = require("express");
const router = express.Router();
const { createUser } = require("../controllers/auth");
const validationMiddleware = require("../middleware/validation");
const { create } = require("../validation/user");
router.post("/user", validationMiddleware(create), createUser);

module.exports = router;
