const mongoose = { Schema } = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  stats: {
    losses: Number,
    wins: Number
  }
});

const User = mongoose.model("User", userSchema);

userSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

module.exports = User;
