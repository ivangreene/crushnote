require('dotenv').config({
  silent: process.env.NODE_ENV === 'production'
});
const chalk = require('chalk');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 3001;

// Configure body parser for AJAX requests
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Session middleware
const sessionMiddleware = session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
});
// Session for express app
app.use(sessionMiddleware);
// Session for socket.io
io.use((socket, next) => sessionMiddleware(socket.request, socket.request.res, next));

// Serve up static assets
app.use(express.static("client/build"));
// Add routes, both API and view
app.use(routes);
// Pass io to configure the socket.io routes
require('./routes/socket')(io);

// Set up promises with mongoose
mongoose.Promise = global.Promise;
// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/" + process.env.LOCAL_MONGO_DB, {useMongoClient: true})
  .then(() => console.log(`${chalk.underline.yellow(`Mongoose`)}: Connected to MongoDB server.`))
  .catch(err => {
    console.error(`${chalk.underline.yellow(`Mongoose`)}: Connection error: ${err}`);
    process.exit(1);
  });

// Start the API server
server.listen(PORT, HOST, function() {
  console.log(`${chalk.underline.white(`express`)}: 🌎  ==> API Server now listening at ${HOST}:${PORT}`);
});
