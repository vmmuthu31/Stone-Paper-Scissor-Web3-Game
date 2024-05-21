// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RockPaperScissors {
    enum Move { None, Rock, Paper, Scissors }
    enum Result { Pending, Player1Wins, Player2Wins, Draw }

    struct Game {
        address player1;
        address player2;
        Move player1Move;
        Move player2Move;
        Result result;
        bool player2Joined;
    }

    Game[] public games;
    mapping(address => bool) public isActive;
    mapping(address => uint256) public playerToGame;

    function createGame(address _opponent) external {
        require(!isActive[msg.sender], "Already in a game");
        require(!isActive[_opponent], "Opponent already in a game");

        games.push(Game({
            player1: msg.sender,
            player2: _opponent,
            player1Move: Move.None,
            player2Move: Move.None,
            result: Result.Pending,
            player2Joined: false
        }));

        uint256 gameId = games.length - 1;
        playerToGame[msg.sender] = gameId;
        playerToGame[_opponent] = gameId;
        isActive[msg.sender] = true;
        isActive[_opponent] = true;
    }

    function joinGame(uint256 _gameId) external {
        require(_gameId < games.length, "Game does not exist");
        Game storage game = games[_gameId];
        require(game.player2 == msg.sender, "Not the opponent");
        require(!game.player2Joined, "Already joined");

        game.player2Joined = true;
    }

    function playMove(Move _move) external {
        require(_move != Move.None, "Invalid move");

        uint256 gameId = playerToGame[msg.sender];
        require(isActive[msg.sender], "Not in a game");

        Game storage game = games[gameId];
        require(game.result == Result.Pending, "Game is over");

        if (msg.sender == game.player1) {
            require(game.player1Move == Move.None, "Already played");
            game.player1Move = _move;
        } else if (msg.sender == game.player2) {
            require(game.player2Move == Move.None, "Already played");
            game.player2Move = _move;
        } else {
            revert("Not a participant");
        }

        if (game.player1Move != Move.None && game.player2Move != Move.None) {
            game.result = determineWinner(game.player1Move, game.player2Move);
            isActive[game.player1] = false;
            isActive[game.player2] = false;
        }
    }

    function determineWinner(Move _player1Move, Move _player2Move) internal pure returns (Result) {
        if (_player1Move == _player2Move) {
            return Result.Draw;
        } else if (
            (_player1Move == Move.Rock && _player2Move == Move.Scissors) ||
            (_player1Move == Move.Paper && _player2Move == Move.Rock) ||
            (_player1Move == Move.Scissors && _player2Move == Move.Paper)
        ) {
            return Result.Player1Wins;
        } else {
            return Result.Player2Wins;
        }
    }

    function getResult(uint256 _gameId) external view returns (Result) {
        require(_gameId < games.length, "Game does not exist");
        return games[_gameId].result;
    }

    function getGame(uint256 _gameId) external view returns (Game memory) {
        require(_gameId < games.length, "Game does not exist");
        return games[_gameId];
    }
}
