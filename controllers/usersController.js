const callDb = require("../lib/usersDbCalls");

module.exports = {
  findAll: function(req, res) {
    callDb.findAll(req.query)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  // find a specific user: used for login to authorize
  findById: function(req, res) {
    callDb.findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  // sign up: create a new user
  create: function(req, res) {
    if (req.body.email &&
      req.body.username &&
      req.body.password &&
      (req.body.password === req.body.passwordConf)) {
      const userData = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
      }
      callDb.create(userData)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    }
  },
  // edit user info: change password/email/username
  update: function(req, res) {
    callDb.update(req.params.id, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  // delete user
  remove: function(req, res) {
    callDb.remove(req.params.id)
      .then(() => res.json({success: true}))
      .catch(err => res.status(422).json(err));
  }
};
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
