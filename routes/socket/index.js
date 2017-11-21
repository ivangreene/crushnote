module.exports = io => {
  require('./chat')(io);
  require('./game')(io);
  require('./user')(io);
};
