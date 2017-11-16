const db = require("../models");

// used in controllers/gamesController.js
module.exports = {
  // lists all current matching games: for joining/watching games
  findAllPromise: (query) => {
    return db.Game.find(query);
  }
  // get game matching your selected game id
  // returned as part of auth cookie info for each user
  findByIdPromise: (id) => {
    return db.Game.findById({id});
  }
  // make a new game
  // if this doesn't work as expected, this might be the problem:
  // https://github.com/Automattic/mongoose/issues/5022
  createPromise: (newState) => {
    return db.Game.create(newState);
  }
  // run this to play the game every turn or socket.io update cycle
  // example usage with express:
  // function(req, res) {
  //   updatePromise(`123foobar`, {user: {}, }).then((data) => res.json(data));
  // }
  updatePromise: (id, newState) => {
    return db.Game.findOneAndUpdate({id}, newState);
  }
  // when last round ends or last player leaves game room, remove game
  // if this doesn't work as expected, this might be the problem:
  // https://github.com/Automattic/mongoose/issues/5022
  removePromise: (id) => {
    return db.Game.findByIdAndRemove({id});
  }
};
