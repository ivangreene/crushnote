const mongoose = { Schema } = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const gameSchema = new Schema({
  players: Array,
  moves: Array,
  cards: {
    remaining: Array,
    discarded: Array
  }
});

const Game = mongoose.model("Article", gameSchema);

gameSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

module.exports = Game;
