const router = require("express").Router();
const User = require("../../controllers/user");

// Matches with "/api/users"
router.route("/")
  .get(function (req, res) {
    User.findAll(req.query)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  })
  // sign up: create a new user
  .post(function (req, res) {
    User.create(userData)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  });

// Matches with "/api/users/:id"
router.route("/:id")
  // find a specific user: used for login to authorize
  .get(function (req, res) {
    User.findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  })
  // edit user info: change password/email/username
  .put(function (req, res) {
    User.update(req.params.id, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  })
  // delete user
  .delete(function (req, res) {
    User.remove(req.params.id)
      .then(() => res.json({ success: true }))
      .catch(err => res.status(422).json(err));
  });

module.exports = router;

/*
function requiresLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    var err = new Error('You must be logged in to view this page.');
    err.status = 401;
    return next(err);
  }
}
router.get('/profile', mid.requiresLogin, function(req, res, next) {
  //...
});
*/
