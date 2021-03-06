var gamer = require('../models/gamer')
let games = require('../models/games.js')


var getAllClients = function (io) {
  return Object.keys(io.sockets.sockets)
}
var emitPlayerList = (io, db) => {
  gamer(db).findAllGamersBySids(getAllClients(io), (err, gamers) => {
    if (!err) {
      io.emit('updateplayers', gamers.map(gamer => ({name: gamer.user_name, socket: gamer.sid})))
    }
  })
}
let getAllPlayers = (io, db, callback) => {
  gamer(db).findAllGamersBySids(shared.getAllClients(io), callback)
}
let getGameMessage = (game, player, opponent) => {
  return {
    player,
    gameID: game._id.toString(),
    opponent,
    game
  }
}

module.exports = {
  getAllClients,
  emitPlayerList,
  getAllPlayers,
  getGameMessage
}