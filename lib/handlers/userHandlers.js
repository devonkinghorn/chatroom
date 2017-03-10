var gamer = require('../models/gamer')
let shared = require('./shared')

let register = function (io, socket, db) {
  return (msg) => {
    if (!msg.userName) {
      socket.emit('login', { error: true, message: 'need a username' });
      return;
    }
    gamer(db).updateGamer(msg.userName, socket.id, (err, res) => {
      socket.emit('login', { error: false, userName: msg.userName })
      shared.emitPlayerList(io, db);
    })
  }
}

module.exports = {
  register: register

}