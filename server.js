
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
//  socket.on('close', closeMsg);
//  socket.on('leave', leaveRoom);
//  socket.on('join', joinRoom);
  socket.on('create', createRoom);
  socket.on('disconnect', disConnect);
  
  function createRoom(){
    var roomID = createId();
    console.log("createdRoom " + roomID);
    ServerRooms.push(roomID);
    socket.join(roomID);
    console.log("joined room");
   // io.sockets.in(roomID).emit('created', roomID);
  }
/*
  function closeMsg(string) {
    io.sockets.emit('link', string);
    console.log(string);
  }
 */ 
  function disConnect(socket){
    console.log('Disconnected Connection: ' + ID);
  }

}

