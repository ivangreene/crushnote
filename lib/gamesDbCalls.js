const db = require("../models");
const shuffle = require('lodash/shuffle');
const gameSeed = () => require('../engine/seed');

// used in controllers/gamesController.js
module.exports = {
  // lists all current matching games: for joining/watching games
  findAll: (query) => {
    return db.Game.find(query);
  },
  // get game matching your selected game id
  // returned as part of auth cookie info for each user
  findById: (id) => {
    return db.Game.findById(id);
  },
  // make a new game
  // if this doesn't work as expected, this might be the problem:
  // https://github.com/Automattic/mongoose/issues/5022
  create: () => {
    let newGame = gameSeed();
    newGame.cards.deck = shuffle(shuffle(newGame.cards.deck)); // Double shuffle em
    newGame.cards.excluded = newGame.cards.deck.shift();
    return db.Game.create(newGame);
  },
  // run this to play the game every turn or socket.io update cycle
  // example usage with express:
  // function(req, res) {
  //   updatePromise(`123foobar`, {user: {}, }).then((data) => res.json(data));
  // }
  update: (_id, newState) => {
    return db.Game.findOneAndUpdate({_id}, newState);
  },
  // when last round ends or last player leaves game room, remove game
  // if this doesn't work as expected, this might be the problem:
  // https://github.com/Automattic/mongoose/issues/5022
  remove: (id) => {
    return db.Game.findByIdAndRemove(id);
  }
};
