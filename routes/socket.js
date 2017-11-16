const moveEngine = require('../engine/game');
const Game = require('../lib/gamesDbCalls');

module.exports = io => {
  io.on('connection', socket => {
    socket.on('gameMove', (gameID, move) => {
      // TODO: Derive the userID from their session,
      // verify that they are a participant in this
      // game, send the move + state to the engine
      // and write/transmit the new game state
      // or emit an error.

      Game.findById(gameID)
        .then(game => moveEngine(game, move))
        .then(newState => {
          Game.update(gameID, newState);
          // TODO: Strip out secret fields of game state before emitting:
          io.to(gameID).emit('gameStateUpdate', newState);
        }, err => socket.emit('gameError', err))
        .catch(err => console.log(err));
    });

    socket.on('newGame', () => {
      // TODO: Create new game awaiting other players
      // and add this client's userID to it.
      io.emit('openGame', 'gameID');
    });

    socket.on('searchingForGame');

    socket.on('joinGame', gameID => {
      // TODO: Add this user to the game (if it is still open)
    });

    socket.on('spectateGame', gameID => {
      // TODO: Send the current game state (with sensitive details scrubbed)
      socket.join(gameID); // Subscribe the user to this game's events
    });
  });
}
