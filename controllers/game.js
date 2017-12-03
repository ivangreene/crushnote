const db = require("../models");
const shuffle = require('lodash/shuffle');
const gameSeed = () => require('../lib/seeds/game');
const playerSeed = () => require('../lib/seeds/player');
const moveEngine = require('../lib/engine/move');

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
  },
  joinGame: (_id, userID) => {
    return new Promise((resolve, reject) => {
      db.Game.findById(_id)
        .then(game => {
          if (!game)
            return reject('Game not found.');
          if (!game.open)
            return reject('Cannot join game in progress.');
          if (game.playerOrder.indexOf(userID) > -1)
            return reject('Player already joined this game.');
          if (game.playerOrder.length >= 4)
            return reject('Game is already full.');
          game.playerOrder.push(userID);
          game.players[userID] = playerSeed();
          // if (game.playerOrder.length >= 4) // This will need to be dealt with
            // game.open = false;
          db.Game.findOneAndUpdate({_id}, game, { new: true }, (err, newGame) => {
            if (err) return console.log(err);
            resolve(newGame);
          });
        })
        .catch(err => console.log(err));
    });
  },
  leaveGame: (_id, userID) => {
    return new Promise((resolve, reject) => {
      db.Game.findById(_id)
        .then(game => {
          if (!game)
            return reject('Game not found.');
          // if (!game.open)
          //   return reject('Cannot leave game in progress.');
          if (!game.playerOrder.indexOf(userID) > -1)
            return reject('Player may only leave a game they have joined.');
          // find userId in playerOrder array and remove it
          const userIDIndex = game.playerOrder.findIndex(item => {item === userID});
          // if it is the first item in the array, then close the room
          if (game.playerOrder.length <= 1 || userIDIndex === 0) {
            // when last player leaves then close the game
            // TODO: check the syntax here - use return or resolve?
            resolve(db.Game.findByIdAndRemove(_id));
          }
          game.playerOrder.splice(userIDIndex, 1);
          // TODO: find userID in the players hash and remove that key/value pair
          // game.players[userID] = playerSeed();
          db.Game.findOneAndUpdate({_id}, game, { new: true }, (err, newGame) => {
            if (err) return console.log(err);
            resolve(newGame);
          });
        })
        .catch(err => console.log(err));
    });
  },
  startGame: (_id, userID) => {
    return new Promise((resolve, reject) => {
      db.Game.findById(_id)
        .then(game => {
          if (!game)
            return reject('Game not found.');
          if (!game.open)
            return reject('Game already started.');
          if (game.playerOrder[0] !== userID)
            return reject('Only the originating player can start a game.');
          game.open = false;
          game.players[game.playerOrder[0]].active = true;
          for (let p = 0; p < game.playerOrder.length; p++) {
            game.players[game.playerOrder[p]].hand = game.cards.deck.shift();
          }
          db.Game.findOneAndUpdate({ _id }, game, { new: true }, (err, newGame) => {
            if (err) return console.log(err);
            resolve(newGame);
          });
        })
        .catch(err => console.log(err));
    });
  },
  gameMove: (_id, move) => {
    return new Promise((resolve, reject) => {
      db.Game.findById(_id)
        .then(game => {
          debugger;
          if (!game)
            return new Error(reject('Game not found.'));
          else
            return game;
        })
        .then(game => moveEngine(game._doc, move))
        .then(newState => {
          db.Game.findOneAndUpdate({_id}, newState)
            .then(() => { });
          resolve(newState);
        }, err => reject(err))
        .catch(err => console.log(err));
    });
  }
};
