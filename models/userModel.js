const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "User name is required"],
    trim: true,
    minLength: [3, "The length of user name can be minium 3 characters"],
    maxLength: [31, "User name can be maximum 31 characters"],
  },
  email: {
    type: String,
    required: [true, "User name is required"],
    trim: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (v) => {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter valid email",
    },
    minLength: [3, "The length of user name can be minium 3 characters"],
    maxLength: [31, "User name can be maximum 31 characters"],
  },
  password: {
    type: String,
    required: [true, "User name is required"],
    minLength: [6, "The length of user name can be minium 6 characters"],
    set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
  },
  image: {
    type: String,
  },
});
