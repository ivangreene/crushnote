const Game = require('../../controllers/game');
const cleanGameState = require('../../lib/gameState').clean;
const User = require('../../controllers/user');
const chalk = require('chalk');

module.exports = (socket, io, userSockets) => {
  // console.log(`${chalk.underline.green(`socket.io`)}: listening for connection`);
  // console.log(`${chalk.underline.green(`socket.io`)}: connection created`);

  /*
  * Game logic
  */
  function sendUserHand(gameId, userId, state, showHand) {
    let partialState = {
      players: {
        [userId]: { hand: state.players[userId].hand }
      }
    };
    if (state.players[userId].active) {
      partialState.cards = { deck: [state.cards.deck[0]] };
    }
    if (showHand && showHand.to.toString() === userId.toString()) {
      partialState.players[showHand.from] = { hand: state.players[showHand.from].hand };
    }
    io.to(userId).emit('partialState', gameId, partialState);
  }

  socket.on('gameMove', (gameId, move) => {
    if (!move) move = {};
    move.player = socket.request.session.userId;
    io.to(gameId).emit('receiveGameMove', move);
    Game.gameMove(gameId, move)
      .then(([newState, showHand]) => {
        // console.log(`gameState in socket/game.js before cleaning:`, newState);
        let cleanState = cleanGameState(newState);
        cleanState.players[socket.request.session.userId].hand = null;
        io.to(gameId).emit('gameStateUpdate', gameId, cleanState);
        newState.playerOrder.map(userId => {
          sendUserHand(gameId, userId, newState, showHand);
        });
      })
      .catch(err => socket.emit('err', { message: err }));
  });

  socket.on('myHand', (gameId) => {
    if (!socket.request.session.userId)
      return socket.emit('err', { message: 'Not authenticated' });
    Game.findById(gameId)
      .then(({_doc}) => {
        if (_doc.players[socket.request.session.userId]) {
          sendUserHand(gameId, socket.request.session.userId, _doc);
        }
        else
          return socket.emit('err', { message: 'Not a participant' });
      })
      .catch(err => {
        return socket.emit('err', { message: 'Game not found' });
      });
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
        // socket.join(cleanState._id);
        io.to(cleanState._id).emit('gameStateUpdate', cleanState);
        io.emit('openGame', cleanState);
      })
      .catch(err => console.log('newGame socket/game.js ERROR:', err));
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
        io.to(joinedGame._id).emit('gameStateUpdate', joinedGame._id, cleanGameState(joinedGame));
      })
      .catch(err => socket.emit('err', { message: err }));
  });

  socket.on('startGame', gameID => {
    // console.log(`gameId`, gameID, `| userId`, socket.request.session.userId);

    Game.startGame(gameID, socket.request.session.userId)
      .then(game => {
        io.to(game._id).emit('gameStarted', game._id, cleanGameState(game));
      })
      .catch(err => socket.emit('err', { message: err }));
  });

  socket.on('leaveGame', gameID => {
    if (!socket.request.session.userId)
      return socket.emit('err', { message: 'Not authenticated' });
    Game.leaveGame(gameID, socket.request.session.userId);
    socket.emit('leftGame');
    io.emit('updateGameList', gameID, socket.request.session.userId);
    socket.leave(gameID); // Unsubscribe the user to this game's events
  });

  socket.on('subscribeToGame', gameID => {
    socket.join(gameID); // Subscribe the user to this game's events
  });
}
