const db = require("../models");

// used in controllers/usersController.js
module.exports = {
  // lists all current matching users
  findAll: (query) => {
    return db.User.find(query);
  },
  // get user matching selected user id
  // returned as part of auth cookie info for each user
  findById: (id) => {
    return db.User.findById({id});
  },
  // make a new user
  // if this doesn't work as expected, this might be the problem:
  // https://github.com/Automattic/mongoose/issues/5022
  create: (userData) => {
    return db.User.create(newState);
  },
  // for editing existing user info: name, email, etc.
  update: (id, newState) => {
    return db.User.findOneAndUpdate({id}, newState);
  },
  // to delete a user from database
  remove: (id) => {
    return db.User.findByIdAndRemove({id});
  }
};
