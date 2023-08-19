const User = require("../models/userModel");
const data = require("./data");
const seedUser = async (req, res, next) => {
  try {
    // delete all user data
    await User.deleteMany({});
    //    create new user data
    const users = await User.insertMany(data.users);
    // successful new users
    return res.status(201).json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { seedUser };
