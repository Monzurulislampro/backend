const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { default: mongoose } = require("mongoose");

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5; // Fixed 'req, query.limit' to 'req.query.limit'

    const searchRegExp = new RegExp(search, "i"); // Renamed 'serchRegExp' to 'searchRegExp'
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };
    const options = { password: 0 };
    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);
    const count = await User.find(filter).countDocuments();
    if (!users) throw createError(404, "NO users found");
    return successResponse(res, {
      statusCode: 200,
      message: "Users were return successfully",
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await User.findById(id, options);
    if (!user) {
      throw createError(message);
    }
    return successResponse(res, {
      statusCode: 200,
      message: "Users were return successfully",
      payload: {
        user,
      },
    });
  } catch (error) {
    if (error instanceof mongoose.Error)
      next(createError(400, "invalid User Id"));
  }
};

module.exports = { getUsers, getUser };
