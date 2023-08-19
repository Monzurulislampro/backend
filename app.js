const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const createError = require("http-errors");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");

const rateLimiter = rateLimit({
  windowMs: 1 + 60 * 1000,
  max: 5,
  message: "To many request from this Ip . please try again later",
});

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
const uri = process.env.URI;
console.log(uri);
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.log("Database connection error: " + error);
  });
// routes
const seedRouter = require("./src/routers/seeRouter");
const userRouter = require("./src/routers/userRouter");
app.use("/api/users", userRouter);
app.use("/api/seed", seedRouter);
app.get("/", rateLimiter, (req, res) => {
  res.send(`server is running on http://localhost:${port}`);
});

// client error handling
app.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

// server error handling
app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
});

module.exports = app;
