const callDb = require("../lib/gamesDbCalls");

module.exports = {
  // lists all current games: for joining/watching games
  findAll: function(req, res) {
    callDb.findAllPromise(req.query)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  // get game matching your selected game id
  // returned as part of auth cookie info for each user
  findById: function(req, res) {
    callDb.findByIdPromise(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  // make a new game
  create: function(req, res) {
    callDb.createPromise(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  // run this to play the game every turn or socket.io update cycle
  update: function(req, res) {
    callDb.updatePromise(req.params.id, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  // when last round ends or last player leaves game room, remove game
  remove: function(req, res) {
    callDb.removePromise(req.params.id)
      .then(() => res.json({success: true}))
      .catch(err => res.status(422).json(err));
  }
};
