
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
  socket.on('closeOthers', closeMsgOther);
  socket.on('leave', leaveRoom);
  socket.on('join', joinRoom);
  socket.on('create', createRoom);
  socket.on('disconnect', disConnect);
  
  function createRoom(data){
    var roomId = createId();
    if(data == true){
      roomId = roomId + "&";
    }
    if(io.sockets.adapter.rooms[roomId]){
      console.log("Room exists already");
      createRoom();
    }
    else{
      console.log("Created room: " + roomId);
      addToRoom(roomId);
    }
  }
  

  
  function joinRoom(roomId){
    if(io.sockets.adapter.rooms[roomId]){
        console.log("Joined existing room: " + roomId);
      if(roomId.charAt(roomId.length - 1) == "&"){
          console.log("joining locked room");
          socket.join(roomId);
          io.sockets.in(roomId).emit('joinLock', roomId);
          var room = io.sockets.adapter.rooms[roomId];
          console.log("Room has " + room.length + " people");
          io.sockets.in(roomId).emit('roomSize', room.length);
       }
       else{
        addToRoom(roomId);
      }
    }
    else{
      var newRoom = createId();
      socket.join(newRoom);
      console.log("Bad Room: " + roomId);
      io.sockets.in(newRoom).emit('badRoom');
      socket.leave(newRoom);
    }
  }
  
  function addToRoom(roomId){
    socket.join(roomId);
    io.sockets.in(roomId).emit('created', roomId);
    var room = io.sockets.adapter.rooms[roomId];
    console.log("Room has " + room.length + " people");
    io.sockets.in(roomId).emit('roomSize', room.length);
  }
  
  function closeMsg(data) {
    console.log(data.message);
    io.sockets.in(data.room).emit('closed', data.message);
    console.log("Closing Tabs in Room: " + data.room);
  }
  
  function closeMsgOther(data){
    console.log(data.message);
    socket.broadcast.to(data.room).emit('closed', data.message);
    console.log("Closing Tabs for others in Room: " + data.room);
  }
  
  function leaveRoom(roomId) {
    io.sockets.in(roomId).emit('left', roomId);
    console.log("Leaving Room: " + roomId)
    socket.leave(roomId);
    if(io.sockets.adapter.rooms[roomId]){
        console.log("Room Size: " + io.sockets.adapter.rooms[roomId].length);
        io.sockets.in(roomId).emit('roomSize', io.sockets.adapter.rooms[roomId].length);
    }
    else{
        console.log("room empty"); 
    }
  }
 
  function disConnect(socket){
    console.log('Disconnected Connection: ' + ID);
  }
}
