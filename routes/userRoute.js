const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret_key = process.env.JWT_TOKEN;
console.log(secret_key);

// post user
const User = require("../models/userSchema");
router.post("/users", (req, res) => {
  const { name, email, jobStatus } = req.body;
  const user = new User({ name, email, jobStatus });

  user
    .save()
    .then(() => res.status(200).send(user))
    .catch((err) => res.status(500).send(err.message));
});
// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, "secret_key", {
      expiresIn: "1h",
    });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Protected route
router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Protected route accessed" });
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, "secret_key", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = user;
    next();
  });
}
// Get all users
router.get("/users", (req, res) => {
  User.find()
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send(err.message));
});
// Get a single user by ID
router.get("/users/:id", (req, res) => {
  const userId = req.params.id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.send(user);
    })
    .catch((err) => res.status(500).send(err.message));
});
// Update a user
router.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const { name, email, jobStatus } = req.body;

  User.findByIdAndUpdate(userId, { name, email, jobStatus }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.send(user);
    })
    .catch((err) => res.status(500).send(err.message));
});
// Delete a user
router.delete("/users/:id", (req, res) => {
  const userId = req.params.id;

  User.findByIdAndRemove(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.send("User deleted successfully");
    })
    .catch((err) => res.status(500).send(err.message));
});
module.exports = router;
