const mongoose = { Schema } = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const gameSchema = new Schema({
  playerOrder: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  players: Object,
  cards: {
    deck: Array,
    played: Array,
    excluded: Number
  },
  open: Boolean,
  completed: Boolean
}, { minimize: false });

const Game = mongoose.model("Game", gameSchema);

gameSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

module.exports = Game;
