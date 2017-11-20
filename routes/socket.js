const moveEngine = require('../engine/game');
const Game = require('../lib/gamesDbCalls');
const UserDb = require('../lib/usersDbCalls');
const User = require('../controllers/usersController');

module.exports = io => {
  console.log("listening for connection");
  io.on('connection', socket => {
    console.log('io connection created');
    /*
    * Game logic
    */
    socket.on('gameMove', (gameID, move) => {
      // TODO: Derive the userID from their session,
      // verify that they are a participant in this
      // game, send the move + state to the engine
      // and write/transmit the new game state
      // or emit an error.
      move.player = socket.request.session.userID;
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

    socket.on('searchingForGame', ()=>{});

    socket.on('joinGame', gameID => {
      // TODO: Add this user to the game (if it is still open)
    });

    socket.on('spectateGame', gameID => {
      // TODO: Send the current game state (with sensitive details scrubbed)
      socket.join(gameID); // Subscribe the user to this game's events
    });

    /*
    * User logic
    */
    socket.on('saveNewUser', userData => {
      console.log(`user data getting passed in server-side:`, userData);
      User.create(userData);
      io.emit('savedUser', userData);
    });

    socket.on('subscribeToTimer', (interval) => {
      console.log('client is subscribing to timer with interval ', interval);
      setInterval(() => {
        socket.emit('timer', new Date());
      }, interval);
    });
  });
}
