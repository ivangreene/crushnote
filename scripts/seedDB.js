require('dotenv').config({ silent: process.env.NODE_ENV === 'production' });
const mongoose = require("mongoose");
const db = require("../models");
mongoose.Promise = global.Promise;

// This file empties the Books collection and inserts the books below
var mongoUri = process.env.MONGODB_URI || "mongodb://localhost/" + process.env.LOCAL_MONGO_DB;
console.log(`Using ${mongoUri}`);
mongoose.connect(
  mongoUri,
  {
    useMongoClient: true
  }
);

// two sample users
const userSeed = [
  {
    username: `winona-ryder`,
    password: `password123`,
    email: `winona@example.com`,
      stats: {
      losses: 2,
      wins: 1
    }
  },
  {
    username: `tom-hanks`,
    password: `password456`,
    email: `tom@example.com`,
      stats: {
      losses: 1,
      wins: 2
    }
  }
];

// Sample game
const gameSeed = {
  players: [],
  moves: [],
  cards: {
    remaining: [],
    discarded: []
  }
}

db.Game
  .remove({})
  .then(() => db.Game.collection.insertOne(gameSeed))
  .then(data => {
    // console.log(data);
    console.log(data.insertedCount + " game inserted!");
  })
  .then(() => db.User.remove({}))
  .then(() => db.User.collection.insertMany(userSeed))
  .then(data => {
    console.log(data.insertedIds.length + " users inserted!");
    console.log(data.insertedIds);
    db.Game.updateOne({}, {$set: {players: data.insertedIds}}).then(console.log);
  }).then(() => db.Game.findOne({}))
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
