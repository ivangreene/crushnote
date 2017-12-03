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
    socket.on('gameMove', (gameId, move) => {
      if (!move) move = {};
      move.player = socket.request.session.userId;
      Game.gameMove(gameId, move)
        .then(newState => {
          let cleanState = cleanGameState(newState);
          io.to(gameId).emit('gameStateUpdate', gameId, cleanState);
        })
        .catch(err => socket.emit('err', { message: err }));
    });

    socket.on('myHand', (gameId) => {
      if (!socket.request.session.userId)
        return socket.emit('err', { message: 'Not authenticated' });
      Game.findById(gameId)
        .then(({_doc}) => {
          if (_doc.players[socket.request.session.userId]) {
            let partialState = {
              players: {
                [socket.request.session.userId]: { hand: _doc.players[socket.request.session.userId].hand }
              }
            };
            if (_doc.players[socket.request.session.userId].active) {
              partialState.cards = { deck: [_doc.cards.deck[0]] };
            }
            return socket.emit('partialState', gameId, partialState);
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

    socket.on('subscribeToGame', gameID => {
      socket.join(gameID); // Subscribe the user to this game's events
    });
}
