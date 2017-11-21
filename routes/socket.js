const Game = require('../lib/gamesDbCalls');
const cleanGameState = require('../lib/gameState').clean;
const User = require('../lib/usersDbCalls');

module.exports = io => {
  console.log("listening for connection");
  io.on('connection', socket => {
    console.log('io connection created');
    /*
    * Game logic
    */
    socket.on('gameMove', (gameID, move) => {
      if (!move) move = {};
      move.player = socket.request.session.userId;
      Game.gameMove(gameID, move)
        .then(newState => {
          let cleanState = cleanGameState(newState);
          io.to(gameID).emit('gameStateUpdate', cleanState);
        })
        .catch(err => socket.emit('gameError', { message: err }));
    });

    socket.on('newGame', () => {
      if (!socket.request.session.userId) {
        return socket.emit('err', { message: 'Not authenticated' });
      }
      Game.create()
        .then(newGame => Game.joinGame(newGame._id, socket.request.session.userId))
        .then(newGame => {
          let cleanState = cleanGameState(newGame);
          socket.join(cleanState._id);
          io.to(cleanState._id).emit('gameStateUpdate', cleanState);
          io.emit('openGame', cleanState._id);
        })
        .catch(err => console.log(err));
    });

    socket.on('searchingForGame', ()=>{
      // TODO: send this user open games
    });

    socket.on('joinGame', gameID => {
      if (!socket.request.session.userId)
        return socket.emit('err', { message: 'Not authenticated' });
      Game.joinGame(gameID, socket.request.session.userId)
        .then(joinedGame => socket.join(joinedGame._id))
        .catch(err => socket.emit('err', { message: err }));
    });

    socket.on('startGame', gameID => {
      Game.startGame(gameID, socket.request.session.userId)
        .then(game => io.to(gameID).emit('gameStarted', gameID))
        .catch(err => socket.emit('err', { message: err }));
    });

    socket.on('spectateGame', gameID => {
      // TODO: Send the current game state (with sensitive details scrubbed)
      socket.join(gameID); // Subscribe the user to this game's events
    });

    /*
    * User logic
    */
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
        console.log(`session:`, socket.request.session);
        socket.request.session.save();
        io.emit('loggedIn', userData);
      });
    });
  });
}
