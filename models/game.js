const mongoose = { Schema } = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const gameSchema = new Schema({
  playerOrder: Array,
  players: Object,
  cards: {
    deck: Array,
    played: Array,
    excluded: Number
  },
  open: Boolean
}, { minimize: false });

const Game = mongoose.model("Game", gameSchema);

gameSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

module.exports = Game;
