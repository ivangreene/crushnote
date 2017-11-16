const router = require("express").Router();
const gamesController = require("../../controllers/gamesController");

// Matches with "/api/gameStates"
router.route("/")
  .get(gamesController.findAll)
  .post(gamesController.create);

// Matches with "/api/gameStates/:id"
router
  .route("/:id")
  .get(gamesController.findById)
  .put(gamesController.update)
  .delete(gamesController.remove);

module.exports = router;
