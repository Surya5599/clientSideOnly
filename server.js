
var express = require('express');

var app = express();

var server = app.listen(process.env.PORT || 3000);

app.use(express.static('public'));

console.log("sever is running");

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

app.get('/', function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.send('OK');
});

function newConnection(socket){
  console.log('new Connection: ' + socket.id);
  var ID = socket.id;
  socket.on('link', closeMsg);
  socket.on('disconnect', disConnect);

  function closeMsg(string) {
    //socket.broadcast.emit('link', string);
    io.sockets.emit('link', string);
    console.log(string);
  }
  
  function disConnect(socket){
    console.log('Disconnected Connection: ' + ID);
  }

}

