var ObjectID = require('mongodb').ObjectID;

module.exports = function (db) {
  var Game = function () { }

  //
  // Create a new game, it contains all the information about the two players, the empty board, the whole
  // game chat record, who is starting the game and who is the current player.
  // 
  Game.create_game = function (player1, player2, callback) {
    db.collection('games').insert({
      player1: player1.name
      , player2: player2.name
      , socket1: player1.socket
      , socket2: player2.socket
      , throws: { player1: [], player2: [] }
      , nextThrow: { player1: "", player2: "" }
      , created_on: new Date()
    }, function (err, result) {
      if (err) return callback(err);
      callback(null, Array.isArray(result) ? result[0] : result);
    })
  }

  Game.find_game = function (game_id, callback) {
    db.collection('games').findOne({ _id: new ObjectID(game_id) }, function (err, doc) {
      if (err) return callback(err);
      if (doc == null) return callback(new Error("could not find the game with id " + game_id));
      return callback(null, doc);
    })
  }

  Game.set_next = function (game_id, playerNumber, nextThrow, callback) {
    db.collection('games').update(
      { _id: new ObjectID(game_id), [`nextThrow.${playerNumber}`]: '', $atomic: true }
      , { $set: { [`nextThrow.${playerNumber}`]: nextThrow } }, function (err, result) {
        if (err) return callback(err);
        if (result == 0) return callback(new Error("It is not your turn"));
        callback(null, null);
      });
  }
  //
  // Attempt to update the board for a specific game and player
  // the update fails if the current players is not the player attempting to update the board
  // notice that since we are doing multiple sets we are using the $atomic operation to ensure
  // we don't get any interleaved updates in between the two sets
  //
  Game.push_results = function (game_id, player1Throw, player2Throw, callback) {
    db.collection('games').update(
      { _id: new ObjectID(game_id), 'nextThrow.player1': { $ne: '' }, 'nextThrow.player2': { $ne: '' }, $atomic: true }
      , {
        $push: { 'throws.player1': player1Throw, 'throws.player2': player2Throw },
        $set: { 'nextThrow.player1': '', 'nextThrow.player2': '' }
      }, callback);
  }

  //
  // Save a chat message to it's corresponding game 
  // we also save the user names for the sender and the receiver
  //
  Game.save_chat_message = function (game_id, from_user_id, to_user_id, message, callback) {
    db.collection('games').update(
      { _id: new ObjectID(game_id) }
      , { $push: { chat: { from: from_user_id, to: to_user_id, message: message } } }
      , function (err, result) {
        if (err) return callback(err);
        if (result == 0) return callback(new Error("No game found to update"));
        callback(null, null);
      }
    )
  }

  // Return Game object class
  return Game;
}