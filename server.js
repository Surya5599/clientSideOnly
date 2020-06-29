
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

var ServerRooms = [];

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
    var roomID = createId();
    if(ServerRooms.includes(roomID)){
      createRoom();
    }
    else{
      ServerRooms.push(roomID);
      socket.join(roomID);
      console.log("created and joined Room: " + roomID);
      io.sockets.in(roomID).emit('created', roomID);
    }
  }
  
  function joinRoom(roomID){
    if(ServerRooms.includes(roomID)){
      socket.join(roomID);
      console.log("joined existing room: " + roomID);
      io.sockets.in(roomID).emit('created', roomID);
    }
    else{
      var newRoom = createId();
      socket.join(newRoom);
      io.sockets.in(newRoom).emit('badRoom');
      socket.leave(newRoom);
    }
  }
  
  function closeMsg(roomId) {
    io.sockets.in(roomId).emit('closed');
    console.log("Closing Tabs in Room: " + roomId);
  }
  
  function leaveRoom(roomId) {
    io.sockets.in(roomId).emit('left');
    console.log("Leaving Room: " + roomId);
    socket.leave(roomId);
  }
 
  function disConnect(socket){
    console.log('Disconnected Connection: ' + ID);
  }

}

