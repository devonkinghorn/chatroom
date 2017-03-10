var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
let userHandlers = require('./lib/handlers/userHandlers')
let gameHandlers = require('./lib/handlers/gameHandlers')
MongoClient = require('mongodb').MongoClient
var MONGO_DB_URL = process.env.MONGO_DB || 'mongodb://localhost:27017/rockpaperscissors';


MongoClient.connect(MONGO_DB_URL, function (err, db) {
  if (err) {
    console.error('failed to connect to mongo')
    return;
  }
  app.use(express.static('public'));

  io.on('connection', function (socket) {
    socket.on('chat message', function (msg) {
      io.emit('chat message', msg);
    });
    socket.on('invite', gameHandlers.invite(io, socket, db))
    socket.on('register', userHandlers.register(io, socket, db))
    socket.on('acceptPlay', gameHandlers.acceptPlay(io, socket, db))
    socket.on('throw', gameHandlers.acceptThrow(io, socket, db))
  });

  http.listen(8080, function () {
    console.log('listening on *:8080');
  });
});

