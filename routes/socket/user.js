const moveEngine = require('../engine/game');
const Game = require('../lib/gamesDbCalls');
const User = require('../lib/usersDbCalls');

module.exports = io => {
  // console.log("listening for connection");
  io.on('connection', socket => {
    // console.log('io connection created');
    socket.on('saveNewUser', userData => {
      // console.log(`signup:\nuser data getting passed in server-side:`, userData);
      User.create(userData);
      io.emit('savedUser', userData);
    });

    socket.on('authUser', userData => {
      // console.log(`auth:\nuser data getting passed in server-side:`, userData);
      User.findAndAuthenticate(userData).then(data => {
        // console.log(`resolve the promise:`, data);
        socket.request.session.userId = data;
        // console.log(`session:`, socket.request.session);
        socket.request.session.save();
        io.emit('loggedIn', data);
      });
    });

    socket.on('logOutUser', data => {
      console.log(`at logOut the cookie is:`, socket.request.session);
    });
  });
}
