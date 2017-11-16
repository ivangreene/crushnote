const callDb = require("../lib/usersDbCalls");

module.exports = {
  findAll: function(req, res) {
    callDb.findAll(req.query)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    callDb.findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    callDb.create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: function(req, res) {
    callDb.update(req.params.id, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    callDb.remove(req.params.id)
      .then(() => res.json({success: true}))
      .catch(err => res.status(422).json(err));
  }
};

