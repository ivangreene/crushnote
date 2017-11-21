module.exports = io => {
  require('./game')(io);
  require('./chat')(io);
};
