const Game = require('../../controllers/game');
const cleanGameState = require('../../lib/gameState').clean;
const User = require('../../controllers/user');
const chalk = require('chalk');

module.exports = io => {
  console.log(`${chalk.underline.green(`socket.io`)}: listening for connection`);
  io.on('connection', socket => {
    console.log(`${chalk.underline.green(`socket.io`)}: connection created`);
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
  });
}
