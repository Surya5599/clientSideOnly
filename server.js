
var express = require('express');

var app = express();

var server = app.listen(process.env.PORT || 3000);

app.use(express.static('public'));

console.log("sever is running");

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

function createId() {
  return Math.random().toString(36).substr(2, 9);
}

app.get('/', function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.send('OK');
});

function newConnection(socket){
  console.log('new Connection: ' + socket.id);
  var ID = socket.id;
  socket.on('close', closeMsg);
  socket.on('leave', leaveRoom);
  socket.on('join', joinRoom);
  socket.on('create', createRoom);
  socket.on('disconnect', disConnect);
  
  function createRoom(){
    var roomId = createId();
    if(io.sockets.adapter.rooms[roomId] == true){
      console.log("Room exists already");
      createRoom();
    }
    else{
      socket.join(roomId);
      console.log("Created and joined Room: " + roomId);
      io.sockets.in(roomId).emit('created', roomId);
    }
  }
  
  function joinRoom(roomId){
    if(io.sockets.adapter.rooms[roomId] == true){
      socket.join(roomId);
      console.log("Joined existing room: " + roomId);
      io.sockets.in(roomId).emit('created', roomId);
    }
    else{
      var newRoom = createId();
      socket.join(newRoom);
      console.log("Bad Room: " + roomId);
      io.sockets.in(newRoom).emit('badRoom');
      socket.leave(newRoom);
    }
  }
  
  function closeMsg(roomId) {
    io.sockets.in(roomId).emit('closed');
    console.log("Closing Tabs in Room: " + roomId);
  }
  
  function leaveRoom(roomId) {
    io.sockets.in(roomId).emit('left', roomId);
    console.log("Leaving Room: " + roomId); 
    socket.leave(roomId);
    if(io.sockets.adapter.rooms[roomId] == true){
      console.log("room is now empty");
    }
    else{
      console.log("room not empty");
    }
  }
 
  function disConnect(socket){
    console.log('Disconnected Connection: ' + ID);
  }
  

}
