const mongoose = { Schema } = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
const cron = require('node-cron');
const chalk = require('chalk');

const gameSchema = new Schema({
  updatedAt: { type: Date, expires: '2d' },
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
  completed: Boolean,
  waiting: Boolean,
  winner: { type: Schema.Types.ObjectId, ref: 'User' }
}, { minimize: false, timestamps: true });

const Game = mongoose.model("Game", gameSchema);

cron.schedule('0 */2 * * *', () => {
  Game.deleteMany({ completed: true })
    .then(purge => console.log(`${chalk.underline.yellow(`Mongoose`)}: Purged ${purge.deletedCount} completed games.`))
    .catch(console.error);
});

gameSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

module.exports = Game;
