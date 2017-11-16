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

const articleSeed = [
  {
    title: "Step 1: Chevron Cowl",
    image: "http://yarnspirations.s3.amazonaws.com/catalog/product/cache/1/small_image/400x400/9df78eab33525d08d6e5fb8d27136e95/6/8/6887_1.jpg",
    href: "http://www.yarnspirations.com/patterns/knitting-patterns/step-1-chevron-cowl.html",
    date: new Date(Date.now()),
    notes: []
  },
  {
    title: "Simple Ridge & Eyelet Dishcloth",
    image: "http://yarnspirations.s3.amazonaws.com/catalog/product/cache/1/small_image/400x400/9df78eab33525d08d6e5fb8d27136e95/1/2/127_1.jpg",
    href: "http://www.yarnspirations.com/patterns/knitting-patterns/simple-ridge-eyelet-dishcloth.html",
    date: new Date(Date.now()),
    notes: []
  }
];

// Sample notes
const noteSeed = [
  {
    title: "Great pattern",
    author: "KnitForever",
    content: "I worked this up with purple mohair. Love it.",
    date: new Date(Date.now())
  },
  {
    title: "Worked alright",
    author: "CrochetMostly",
    content: "I wouldn't recommend this to beginners.",
    date: new Date(Date.now())
  }
];

db.Article
  .remove({})
  .then(() => db.Article.collection.insertMany(articleSeed))
  .then(data => {
    console.log(data.insertedIds.length + " articles inserted!");
  })
  .then(() => db.Note.remove({}))
  .then(() => db.Note.collection.insertMany(noteSeed))
  .then(data => {
    console.log(data.insertedIds.length + " notes inserted!");
    console.log(data.insertedIds);
    db.Article.updateOne({}, {$set: {notes: data.insertedIds}}).then(console.log);
  }).then(() => db.Article.findOne({}))
  .then(article => {
      return db.Note.updateMany({}, {$set: {parentArticle: article._id}});
  }).then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
