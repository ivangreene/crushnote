const mongoose = { Schema } = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema({
  username: {type: String, required: true, unique: true },
  password: {type: String, required: true },
  email: String,
  stats: {
    losses: Number,
    wins: Number
  }
});

//authenticate input against database
UserSchema.statics.authenticate = function (username, password, callback) {
  User.findOne({ username: username })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

const User = mongoose.model("User", userSchema);

userSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

module.exports = User;
