const expect = require('chai').expect;
//const io = require('socket.io-client');
const io = require('../routes/socket.js');

const socketURL = 'http://0.0.0.0:5000';

const options ={
  transports: ['websocket'],
  'force new connection': true
};

const user1 = {
	username: `winona-ryder`,
	password: `password123`,
	email: `winona@example.com`,
	  stats: {
	  losses: 2,
	  wins: 1
	}
};

const user2 = {
    username: `tom-hanks`,
    password: `password456`,
    email: `tom@example.com`,
      stats: {
      losses: 1,
      wins: 2
    }
};

const user3 = {
    username: `cate-blanchett`,
    password: `password789`,
    email: `cate@example.com`,
      stats: {
      losses: 0,
      wins: 1
    }
};

it('Should broadcast new user to all users', function(done){
  var client1 = io.connect(socketURL, options);

  client1.on('connect', function(data){
    client1.emit('connection name', user1);

    /* Since first client is connected, we connect
    the second client. */
    var client2 = io.connect(socketURL, options);

    client2.on('connect', function(data){
      client2.emit('connection name', user2);
    });

    client2.on('new user', function(usersName){
      expect(usersName).to.equal(user2.username + " has joined.");
      client2.disconnect();
    });

  });

  var numUsers = 0;
  client1.on('new user', function(usersName){
    numUsers += 1;

    if(numUsers === 2){
      expect(usersName).to.equal(user2.name + " has joined.");
      client1.disconnect();
      done();
    }
  });
});
