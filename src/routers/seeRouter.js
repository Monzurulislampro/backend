const express = require("express");
const { seedUser } = require("../controllers/seedUser");
const seedRouter = express.Router();

seedRouter.get("/users", seedUser);

module.exports = seedRouter;
