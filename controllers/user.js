const db = require("../models");

// used in controllers/usersController.js
module.exports = {
  // lists all current matching users
  findAll: (query) => {
    return db.User.find(query);
  },

  // lists all current matching users
  findMany: (ids, options) => {
    return db.User.find({'_id': { $in: ids}}).select(options);
  },

  // findAllUsers: (query) => {
  //   return db.users.find(query);
  // },
  // get user matching selected user id
  // returned as part of auth cookie info for each user
  findById: (id) => {
    return db.User.findById(id);
  },
  findAndAuthenticate: (userData) => {
    return new Promise((resolve, reject) => {
      console.log(`password and username in usersDbCalls.js:`, userData);
      if (userData.username && userData.password) {
        db.User.authenticate(userData.username, userData.password, function (error, user) {
          if (error || !user) {
            var err = new Error('Wrong username or password.');
            err.status = 401;
            reject(err);
          } else {
            // req.session.userId = user._id;
            console.log(`successful login of ${user.username} with id ${user._id}`);
            // this is the id to tie the session to
            resolve(user._id);
          }
        });
      } else {
        reject(`User data must have username and password fields`);
      }
    });
  },
  // make a new user
  // if this doesn't work as expected, this might be the problem:
  // https://github.com/Automattic/mongoose/issues/5022
  create: (userData) => {
    console.log(`user data in usersDbCalls.js:`, userData);
    if (userData.email &&
      userData.username &&
      userData.password &&
      (userData.password === userData.passwordConfirm)) {
      const data = {
        email: userData.email,
        username: userData.username,
        password: userData.password
      }
      return db.User.create(data);
    }
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
