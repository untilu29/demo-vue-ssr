// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var nJwt = require('njwt');
var port = process.env.PORT || 3000;

var cert = "4wdBcUUuJ2uhnuxdAvVBx8vUKExePfD6WWVtDXBbQEKsPKMMyY5Hxf4eGfMMB2vmegyCgsmr2DeYUJkLwkg7HWum3djXGjzAaqDu"
var secret = Buffer.from(cert, 'base64')
//var token = "eyJhbGciOiJIUzUxMiJ9.eyJhY2NvdW50SWQiOiJoaWVuQGdtYWlsLmNvbSIsImNsaWVudFR5cGUiOiJ1c2VyIiwidG9rZW5fZXhwaXJhdGlvbl9kYXRlIjoxNDkyNjUzMjYwODAwLCJ1c2VySUQiOiI1OGY3OGE0OGM5ZTc3YzAwMDE1ODMwMjUiLCJ0b2tlbl9jcmVhdGVfZGF0ZSI6eyJ5ZWFyIjoyMDE3LCJtb250aCI6IkFQUklMIiwibW9udGhWYWx1ZSI6NCwiZGF5T2ZNb250aCI6MjAsImhvdXIiOjEsIm1pbnV0ZSI6MjQsInNlY29uZCI6MjAsIm5hbm8iOjc5OTAwMDAwMCwiZGF5T2ZXZWVrIjoiVEhVUlNEQVkiLCJkYXlPZlllYXIiOjExMCwiY2hyb25vbG9neSI6eyJjYWxlbmRhclR5cGUiOiJpc284NjAxIiwiaWQiOiJJU08ifX19.BTqUoHMSBWicJNtv31V7IHiehPwT6Y34f2iEXKBFwrs45zjGS-KNV3id2HQluypZJVpcvMneFZd5b9jgBjAKPQ"

server.listen(port, function () {	
	console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

var numUsers = 0;
var users = [];

io.use(function(socket, next){
  if (socket.handshake.query && socket.handshake.query.token){
    nJwt.verify(socket.handshake.query.token, secret, 'HS512',function(err,payload) {
      if(err) {
		  return next(new Error('Authentication error'));
	  }
      socket.decoded = payload;
	  console.log("New user is coming: " + payload.body.name);
      next();
    });
  }
  next(new Error('Authentication error'));
})
.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new_message', function (data) {
    // we tell the client to execute 'new message'
	// console.log(socket.decoded.body.name);
    io.sockets.emit('new_message', {
	  id : socket.decoded.body.userID,
      name: socket.decoded.body.name,
      username: socket.decoded.body.accountId,
      message: data,
	  avatar: socket.decoded.body.avatar,
	  time: (new Date().getTime())
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add_user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    ++numUsers;
    addedUser = true;
	users.push({
		id: socket.decoded.body.userID,
		name: socket.decoded.body.name,
		avatar: socket.decoded.body.avatar
	});
	
    socket.emit('login', {
      name: socket.decoded.body.name,
      numUsers: numUsers,
	    users: users
    });
	console.log(socket.decoded.body.name + " has join the room!");
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user_joined', {
      id: socket.decoded.body.userID,
	  name: socket.decoded.body.name,
	  avatar: socket.decoded.body.avatar,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    // console.log("Username la",socket.username);
    socket.broadcast.emit('typing', {
      username: socket.decoded.body.username,
      name: socket.decoded.body.name
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop_typing', function () {
    socket.broadcast.emit('stop_typing', {
       username: socket.decoded.body.username,
      name: socket.decoded.body.name
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;
	  users = users.filter(function( obj ) {
		return obj.id != socket.decoded.body.userID;
	  });
	  console.log(socket.decoded.body.name + " has left!");
      // echo globally that this client has left
      socket.broadcast.emit('user_left', {
        id: socket.decoded.body.userID,
         username: socket.decoded.body.username,
        name: socket.decoded.body.name,
        numUsers: numUsers
      });
    }
  });
});