const express = require("express");
const router = express.Router();

const User = require("../models/userSchema");
const { getUser } = require("../controllers/userController");
router.post("/users", getUser);

module.exports = router;
