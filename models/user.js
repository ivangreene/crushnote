const mongoose = { Schema } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {type: String, required: true, unique: true },
  password: {type: String, required: true },
  email: String,
  stats: {
    losses: Number,
    wins: Number
  }
});

//hashing a password before saving it to the database
userSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

//authenticate input against database
userSchema.statics.authenticate = function (name, password, callback) {
  User.findOne({ username: name })
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
