const router = require("express").Router();
const Game = require("../../controllers/game");
const cleanGameState = require('../../lib/gameState').clean;

// Matches with "/api/games"
router.route("/")
  // lists all current games: for joining/watching games
  .get(function (req, res) {
    Game.findAll(req.query)
      .then(games => res.json(games.map(cleanGameState)))
      .catch(err => res.status(422).json(err));
  })
  // make a new game -- should be taken care of by a socket route
  /*.post(function (req, res) {
    Game.create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  })*/;

// Matches with "/api/games/:id"
router.route("/:id")
  // get game matching your selected game id
  // returned as part of auth cookie info for each user
  .get(function (req, res) {
    Game.findById(req.params.id)
      .then(game => res.json(cleanGameState(game)))
      .catch(err => res.status(422).json(err));
  })
  // the below should be handled by socket events:
  // run this to play the game every turn or socket.io update cycle
  /*.put(function (req, res) {
    Game.update(req.params.id, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  })
  // when last round ends or last player leaves game room, remove game
  .delete(function (req, res) {
    Game.remove(req.params.id)
      .then(() => res.json({ success: true }))
      .catch(err => res.status(422).json(err));
  })*/;

module.exports = router;
