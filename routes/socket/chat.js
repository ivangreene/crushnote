const chalk = require('chalk');

module.exports = (socket, io, userSockets) => {
    //console.log(`${chalk.underline.green(`socket.io, CHAT`)}: User connected`);
    // console.log(`${chalk.underline.green(`socket.io, CHAT`)}: ${socket.id}`);

    socket.on('SEND_MESSAGE', function (data) {
      io.emit('RECEIVE_MESSAGE', data);
    });

    socket.on('error', function (err) {
      console.log(`${chalk.underline.green(`socket.io, CHAT`)}: ${err}`);
    });

    socket.on('disconnect', () => {
      console.log(`${chalk.underline.green(`socket.io, CHAT`)}: User disconnected`)
    });
};
