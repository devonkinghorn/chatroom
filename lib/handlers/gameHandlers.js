var gamer = require('../models/gamer')
let games = require('../models/games.js')
let shared = require('./shared')



let invite = function (io, socket, db) {
  return (msg) => {
    let response = { invited: msg.invited, inviter: { name: msg.inviter, socket: socket.id } }
    io.to(msg.invited.socket).emit('invite', response)
  }
}

let acceptPlay = function (io, socket, db) {
  return msg => {
    msg.player1.socket = socket.id;
    games(db).create_game(msg.player1, msg.player2, (err, res) => {
      if (err) return;
      let game = res.ops[0]
      let gameID = game._id.toString()
      io.to(game.socket1).emit('startGame', shared.getGameMessage(game, 'player1', 'player2'));
      io.to(game.socket2).emit('startGame', shared.getGameMessage(game, 'player2', 'player1'));
    })
  }
}
let acceptThrow = function (io, socket, db) {
  return msg => {
    games(db).set_next(msg.game.gameID, msg.game.player, msg.throw, (err, r) => {
      if (err) return;
      games(db).find_game(msg.game.gameID, (err, res) => {
        if (err) return;
        if (res.nextThrow.player1 && res.nextThrow.player2) {
          games(db).push_results(msg.game.gameID, res.nextThrow.player1, res.nextThrow.player2, (err, res) => {
            games(db).find_game(msg.game.gameID, (err, res2) => {
              let game = res2
              io.to(game.socket1).emit('nextRound', shared.getGameMessage(game, 'player1', 'player2'));
              io.to(game.socket2).emit('nextRound', shared.getGameMessage(game, 'player2', 'player1'));
            })
          })
        }
        console.log(res)
      })

    })
  }
}
module.exports = {
  invite,
  acceptPlay,
  acceptThrow
}