const Game = require('../../controllers/game');
const User = require('../../controllers/user');
const bcrypt = require("bcrypt");
const chalk = require('chalk');

const sockChalk = chalk.underline.green(`socket.io:`);
const userInfoChalk = chalk.underline.red(`user:`);

const redirect = (socket, user) => {
  let destination = '/';
  if (user) destination = '/main';
  socket.emit('redirect', destination);
};

module.exports = (socket, io, userSockets) => {
  let user = null;
  let token;
  if (socket.request.headers.cookie) {
    const cookie = socket.request.headers.cookie.split(';').reduce(
      (accumulator, pair) => {
        const parts = pair.trim().split('=');
        accumulator[parts[0]] = parts[1];
        return accumulator;
      }, {})
    token = cookie.sid;
  }
  if (token) {
    let arr = token.split('-');
    let obfuscated = arr[0];
    let hash = arr[1];
    let plaintext = Buffer.from(obfuscated, 'base64').toString();
    bcrypt.compare(plaintext+process.env.COOKIE_SECRET, hash).then(function(res) {
      let id = plaintext.split('-')[0].trim();
      User.findById(id).then(user => {
        let data = {name: user.username, id: user._id, stats: {wins: user.stats.wins, losses: user.stats.losses}};
        socket.join(user._id);
        socket.emit(`loggedIn`, data);
        io.emit(`userLoggedIn`, data);
        socket.request.session.userId = user._id;
        socket.request.session.username = user.username;
        user = data;
        userSockets[user.id.toString()] = socket;
      });
    });
  }

  socket.on('getActiveUsers', () => {
    let userIds = Object.keys(userSockets);
    User.findMany(userIds, { "email": 0, "password": 0, "__v": 0})
    .then(users => socket.emit('recieveActiveUsers', users));
  });

  /*
  get active users:
  1: every time a user logs in, match them up with their session id in a map
  2: store username and userId on session
  */

  socket.on('saveNewUser', userData => {
    User.create(userData)
    .then(data => {
      console.log('data:', data);
      socket.emit('savedUser', userData)
    })
    .catch(err => {
      console.log(`error:`, err);
      socket.emit('createUserFail', err)
    });
  });

  socket.on('authUser', userData => {
    User.findAndAuthenticate(userData).then(userId => {
      userSockets[userId.toString()] = socket;

      const days = 14;
      let date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000)); // set day value to expiry
      const expires = date.toGMTString();

      let rawString = userId+`-`+expires;
      let obfuscated = Buffer.from(rawString).toString('base64');
      let encrypted;
      bcrypt.hash(rawString+process.env.COOKIE_SECRET, 10).then(function(hash) {
        encrypted = hash;
        let authToken = `${obfuscated}-${encrypted}`

        const sidCookie = "sid=" + authToken + ";expires=" + expires + ";path=/";
        socket.emit('logInSuccess');
        socket.emit('setCookie', sidCookie);
        io.emit('userLoggedIn', userId);
        redirect(socket, userId);
      });
    }).catch(err => {
      socket.emit('logInFail');
      socket.emit('err', err);
    });
  });

  socket.on('logOutUser', data => {
    logOutUser(data);
  });

  const logOutUser = data => {
    delete userSockets[socket.request.session.userId.toString()];
    user = null;
    const sidCookie = "sid=; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    socket.emit('setCookie', sidCookie);
    let timeoutId;
    if (timeoutId) clearInterval(timeoutId);
    timeoutId = setTimeout(() => {
      io.emit('userLoggedOut',
        [socket.request.session.userId,
        Object.keys(userSockets)]);
    }, 1000);
    socket.leave(socket.request.session.userId);
    socket.disconnect(true);
  };

  socket.on(`abandonGame`, data => {
    // then score game as a loss for leaving player
    //User.update(userID, $inc: { stats.losses : 1 });
  });

  socket.on('disconnect', (reason) => {
    console.log(`user session ended because:`, reason);
    console.log(`socket.request.session.userId info:`, socket.request.session.userId);
    if (socket.request.session.userId) {
      delete userSockets[socket.request.session.userId.toString()];
      user = null;
      io.emit('userLoggedOut');
    }
  });
}
