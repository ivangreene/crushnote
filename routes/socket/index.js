
const userSockets = {};

module.exports = io => {
	io.on('connection', socket => {
	  require('./chat')(socket, io, userSockets);
	  require('./game')(socket, io, userSockets);
	  require('./user')(socket, io, userSockets);
	});
};
