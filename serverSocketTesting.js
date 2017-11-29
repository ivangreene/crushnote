var io = require('socket.io').listen(5000);

io.sockets.on('connection', function (socket) {
  socket.on('connection name',function(user){
    io.sockets.emit('new user', user.name + " has joined.");
  })

});
