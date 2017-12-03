const Game = require('../../controllers/game');
const cleanGameState = require('../../lib/gameState').clean;
const User = require('../../controllers/user');
const chalk = require('chalk');

module.exports = (socket, io) => {
  console.log(`${chalk.underline.green(`socket.io`)}: listening for connection`);
    console.log(`${chalk.underline.green(`socket.io`)}: connection created`);
    /*
    * Game logic
    */
    function sendUserHand(gameId, userId, state) {
      let partialState = {
        players: {
          [userId]: { hand: state.players[userId].hand }
        }
      };
      if (state.players[userId].active) {
        partialState.cards = { deck: [state.cards.deck[0]] };
      }
      io.to(userId).emit('partialState', gameId, partialState);
    }

    socket.on('gameMove', (gameId, move) => {
      if (!move) move = {};
      move.player = socket.request.session.userId;
      Game.gameMove(gameId, move)
        .then(newState => {
          let cleanState = cleanGameState(newState);
          io.to(gameId).emit('gameStateUpdate', gameId, cleanState);
          newState.playerOrder.map(userId => {
            sendUserHand(gameId, userId, newState);
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
          socket.join(cleanState._id);
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
      Game.startGame(gameID, socket.request.session.userId)
        .then(game => io.to(gameID).emit('gameStarted', gameID))
        .catch(err => socket.emit('err', { message: err }));
    });

    socket.on('leaveGame', gameID => {
      if (!socket.request.session.userId)
        return socket.emit('err', { message: 'Not authenticated' });
      Game.leaveGame(gameID, socket.request.session.userId);
      socket.leave(gameID); // Unsubscribe the user to this game's events
    });

    socket.on('subscribeToGame', gameID => {
      socket.join(gameID); // Subscribe the user to this game's events
    });
}
