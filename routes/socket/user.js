const Game = require('../../controllers/game');
const User = require('../../controllers/user');
const bcrypt = require("bcrypt");
const chalk = require('chalk');

const sockChalk = chalk.underline.green(`socket.io`);

const redirect = (socket, user) => {
  let destination = '/';
  if (user) destination = '/main';
  socket.emit('redirect', destination);
};

module.exports = (socket, io) => {
  let user = null;
  let userSockets = {};
  let token;
  if (socket.request.headers.cookie) {
    const cookie = socket.request.headers.cookie.split(';').reduce(
      (accumulator, pair) => {
        const parts = pair.trim().split('=');
        accumulator[parts[0]] = parts[1];
        return accumulator;
      }, {})
    // console.log(cookie);
    token = cookie.sid;
    // console.log(`the token is ${token}`);
  }
  if (token) {
    let arr = token.split('-');
    let obfuscated = arr[0];
    let hash = arr[1];
    console.log(arr, obfuscated, hash);
    let plaintext = Buffer.from(obfuscated, 'base64').toString();
    console.log(plaintext);
    bcrypt.compare(plaintext+process.env.COOKIE_SECRET, hash).then(function(res) {
      // console.log(`${sockChalk}: Current sid cookie is valid`);
      let id = plaintext.split('-')[0].trim();
      console.log(`${sockChalk}: the id is now ${id}`);
      User.findById(id).then(user => {
        let data = {name: user.username, id: user._id};
        socket.join(user._id);
        socket.emit(`loggedIn`, data);
        socket.request.session.userId = user._id;
        user = data;
        userSockets[user.id] = socket;
        // redirect(socket, user);
      });
    });
  }

  socket.on('saveNewUser', userData => {
    User.create(userData);
    socket.emit('savedUser', userData);
  });

  socket.on('authUser', userData => {
    User.findAndAuthenticate(userData).then(data => {
      user = data;
      userSockets[user.id] = socket;

      console.log(`${sockChalk}: cookie:`, socket.request.headers.cookie);
      const days = 14;
      let date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000)); // set day value to expiry
      const expires = date.toGMTString();

      let rawString = data+`-`+expires;
      let obfuscated = Buffer.from(rawString).toString('base64');
      let encrypted;
      bcrypt.hash(rawString+process.env.COOKIE_SECRET, 10).then(function(hash) {
        encrypted = hash;
        // console.log(`${sockChalk}: the encrypted string is ${encrypted}`);
        let authToken = `${obfuscated}-${encrypted}`

        const sidCookie = "sid=" + authToken + ";expires=" + expires + ";path=/";
        socket.emit('setCookie', sidCookie);
        io.emit('userLoggedIn', data);
        redirect(socket, user);
      });
    });
  });

  socket.on('logOutUser', data => {
    // Do we need to do anything on the back end when a user logs out?
    console.log(`${sockChalk}: session info:`, socket.request.session);
    socket.leave(user._id);
    // io.emit('userLoggedOut', socket.request.session.userId);
    // console.log(`${sockChalk}: at logOut the cookie is:`, socket.request.session.cookie);
  });

  socket.on(`abandonGame`, data => {
    // then score game as a loss for leaving player
    //User.update(userID, $inc: { stats.losses : 1 });
  });
}
