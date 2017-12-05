const Game = require('../../controllers/game');
const cleanGameState = require('../../lib/gameState').clean;
const User = require('../../controllers/user');
const chalk = require('chalk');

module.exports = (socket, io, userSockets) => {
  console.log(`${chalk.underline.green(`socket.io`)}: listening for connection`);
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
          // This doesn't work because the client makes a new socket
          // when they redirect.
          //socket.join(cleanState._id);
          io.to(cleanState._id).emit('gameStateUpdate', cleanState);
          io.emit('openGame', cleanState);
        })
        .catch(err => console.log(err));
    });

    socket.on('searchingForGame', () => {
      Game.findAll({})
        .then(games => socket.emit('games', games.map(cleanGameState)))
        // We may want to indicate an error to the client somehow.
        .catch(err => socket.emit('games', []));
    });

    socket.on('joinGameRoom', gameID => {
      socket.join(gameID);
    });

    socket.on('joinGame', gameID => {
      if (!socket.request.session.userId)
        return socket.emit('err', { message: 'Not authenticated' });
      Game.joinGame(gameID, socket.request.session.userId)
        .then(joinedGame => {
          socket.join(joinedGame._id);
          io.emit('gameStateUpdate', cleanGameState(joinedGame));
        })
        .catch(err => socket.emit('err', { message: err }));
    });

    socket.on('startGame', gameID => {
      console.log(`recieved startGame event from client`);
      console.log(`gameId`, gameID, `| userId`, socket.request.session.userId);
      Game.startGame(gameID, socket.request.session.userId)
        .then(game => {
          io.to(game._id).emit('gameStarted', cleanGameState(game));
        })
        .catch(err => socket.emit('err', { message: err }));
    });

    socket.on('leaveGame', gameID => {
      if (!socket.request.session.userId)
        return socket.emit('err', { message: 'Not authenticated' });
      Game.leaveGame(gameID, socket.request.session.userId);
      socket.emit('leftGame');
      socket.leave(gameID); // Unsubscribe the user to this game's events
    });

    socket.on('spectateGame', gameID => {
      // TODO: Send the current game state (with sensitive details scrubbed)
      socket.join(gameID); // Subscribe the user to this game's events
    });
}
