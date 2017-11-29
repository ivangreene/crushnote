module.exports = io => {
	io.on('connection', socket => {
	  require('./chat')(socket, io);
	  require('./game')(socket, io);
	  require('./user')(socket, io);
	});
};
