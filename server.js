
require('dotenv').config({ silent: process.env.NODE_ENV === 'production' });
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 3001;

// Configure body parser for AJAX requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Session middleware
const sessionMiddleware = session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  name: 'ofo'
});
app.use(sessionMiddleware);
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
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/" + process.env.LOCAL_MONGO_DB,
  {
    useMongoClient: true
  }
);

// Start the API server
server.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});

//-----Socket config------//
io.on('connection', (socket) => {
  console.log("User connected");
    console.log(socket.id);

    socket.on('SEND_MESSAGE', function(data){
       io.emit('RECEIVE_MESSAGE', data);
   });

   socket.on('disconnect', () => {
       console.log('user disconnected')
     });
});
