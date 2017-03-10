var app = angular.module('myApp', []);
    app.controller('myCtrl',
      function ($scope, $window, $http) {
        var socket = io();
        $scope.opponent = '';
        $scope.login = true;
        $scope.search = true;
        $scope.searchText = ''
        $scope.check = function (username) {
          console.log(username)
          if (username != '') {
            console.log('signing in')
            socket.emit('register', {
              userName: username
            })
          }
        };
        $scope.play = function (invited) {
          if (invited.button == 'invite') {
            socket.emit('invite', {
              inviter: $scope.username,
              invited: invited
            })
          } else {
            socket.emit('acceptPlay', {
              player1: {name: $scope.username},
              player2: invited
            })
          }
        }
        $scope.sendMessage = function (e) {
          e.preventDefault();
          console.log(e);
          if (!$scope.messageInput) return;
          socket.emit('invite', {
            text: $scope.messageInput,
            user: $scope.user,
            //   avatar: $scope.avatar
          });
          $scope.messageInput = '';
        }
        $scope.back = () => {
          $scope.search = true;
        }
        $scope.throw = (_throw) => {
          socket.emit('throw',{throw: _throw, game: $scope.game})
        }
        var invitations = {};
        socket.on('updateplayers', function (msg) {
          $scope.$apply(function () {
            $scope.currentUsers = msg.map(function (player) {
              return {
                name: player.name,
                socket: player.socket,
                button: (invitations[player.name] ? 'play' : 'invite')
              }
            }).filter(user => user.name != $scope.username);
          })
        });
        socket.on('login', function (msg) {
          $scope.$apply(function () {
            if (msg.error) {
              alert(msg.message)
            } else {
              $scope.username = msg.userName;
              $scope.login = false;
              $scope.search = true;
            }
          })
        })
        socket.on('startGame', function (msg) {
          $scope.$apply(function () {
            if ($scope.search) {
              $scope.search = false;
              $scope.game = msg
              $scope.results = "Play first round"
              $scope.score = [0,0]
            }
          })
        })
        var possibleThrows = {
          "rock":0,
          "paper":1,
          "scissors":2
        }
        socket.on('nextRound', function(msg){
          $scope.$apply(function () {
            var player = msg.player;
            var opponent = msg.opponent;
            var playerThrowName = msg.game.throws[player].slice(-1)[0];
            var playerThrow = possibleThrows[playerThrowName];
            var opponentThrowName = msg.game.throws[opponent].slice(-1)[0];
            var opponentThrow = possibleThrows[opponentThrowName];
            if(playerThrow == opponentThrow) {
              $scope.results = `It was a Tie, you both threw ${playerThrowName}`
            } else if((playerThrow + 1)%3 == opponentThrow) {
              $scope.results = `You Lost last round you threw ${playerThrowName} they threw ${opponentThrowName}`
              $scope.score[1]++;
            } else {
              $scope.results = `You Won last round you threw ${playerThrowName} they threw ${opponentThrowName}`
              $scope.score[0]++;
            }

            debugger;
            console.log(msg)
          })
        })
        socket.on('invite', function (msg) {
          
          $scope.$apply(function () {
            if (msg.invited.name == $scope.username) {
              invitations[msg.inviter.name] = true;
              $scope.currentUsers.forEach(function (user) {
                if (invitations[msg.inviter.name]) {
                  user.button = 'play';
                }
              })
              
            }
          })
        });
      })