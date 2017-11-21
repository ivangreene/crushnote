const chalk = require('chalk');

module.exports = io => {
  io.on('connection', (socket) => {
    console.log(`${chalk.underline.green(`socket.io`)}: User connected`);
    console.log(`${chalk.underline.green(`socket.io`)}: ${socket.id}`);

    socket.on('SEND_MESSAGE', function (data) {
      io.emit('RECEIVE_MESSAGE', data);
    });

    socket.on('error', function (err) {
      console.log(`${chalk.underline.green(`socket.io`)}: ${err}`);
    });

    socket.on('disconnect', () => {
      console.log(`${chalk.underline.green(`socket.io`)}: User disconnected`)
    });
  });
};
