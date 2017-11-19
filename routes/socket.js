const moveEngine = require('../engine/game');
const Game = require('../lib/gamesDbCalls');
const cleanGameState = require('../lib/gameState').clean;

module.exports = io => {
  io.on('connection', socket => {
    socket.on('gameMove', (gameID, move) => {
      // TODO: Derive the userID from their session,
      // verify that they are a participant in this
      // game, send the move + state to the engine
      // and write/transmit the new game state
      // or emit an error.
      if (!move) move = {};
      move.player = socket.request.session.userID;
      Game.gameMove(gameID, move)
        .then(newState => {
          let cleanState = cleanGameState(newState);
          io.to(gameID).emit('gameStateUpdate', cleanState);
        })
        .catch(err => socket.emit('gameError', { message: err }));
    });

    socket.on('setuid', id => {
      socket.request.session.userID = id;
      socket.request.session.save();
    });

    socket.on('newGame', () => {
      if (!socket.request.session.userID) {
        return socket.emit('err', { message: 'Not authenticated' });
      }
      Game.create()
        .then(newGame => Game.joinGame(newGame._id, socket.request.session.userID))
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
      Game.joinGame(gameID, socket.request.session.userID)
        .then(joinedGame => socket.join(joinedGame._id))
        .catch(err => socket.emit('err', { message: err }));
    });

    socket.on('startGame', gameID => {
      Game.startGame(gameID, socket.request.session.userID)
        .then(game => io.to(gameID).emit('gameStarted', gameID))
        .catch(err => socket.emit('err', err));
    })

    socket.on('spectateGame', gameID => {
      // TODO: Send the current game state (with sensitive details scrubbed)
      socket.join(gameID); // Subscribe the user to this game's events
    });
  });
}
