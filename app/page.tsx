"use client";
import Navbar from "./Components/Navbar";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import RockPaperScissorsABI from "./abi.json"; // ABI file

const contractAddress = "0x1B28FeEa0985e407c3b45fA6b3Fe90293EA24091";

const moveImages = {
  1: "https://t3.ftcdn.net/jpg/01/23/14/80/360_F_123148069_wkgBuIsIROXbyLVWq7YNhJWPcxlamPeZ.jpg", // Replace with your actual image paths
  2: "https://png.pngtree.com/png-vector/20220624/ourmid/pngtree-torn-notebook-paper-white-coil-png-image_5317122.png",
  3: "https://www.shutterstock.com/image-photo/scissors-sewing-isolated-on-white-260nw-1324077986.jpg",
};

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [opponent, setOpponent] = useState("");
  const [move, setMove] = useState("");
  const [gameId, setGameId] = useState("");
  const [joinedGameId, setJoinedGameId] = useState("");
  const [game, setGame] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = provider.getSigner();
        setSigner(signer);

        const address = await signer.getAddress();
        setAccount(address);

        const contract = new ethers.Contract(
          contractAddress,
          RockPaperScissorsABI,
          signer
        );
        setContract(contract);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const fetchGame = async () => {
      if (contract && joinedGameId) {
        try {
          const game = await contract.getGame(joinedGameId);
          setGame({
            player1: game.player1,
            player2: game.player2,
            player1Move: game.player1Move,
            player2Move: game.player2Move,
            result: game.result,
            player2Joined: game.player2Joined,
          });
          setResult(game.result);
        } catch (error) {
          console.error("Error fetching game:", error);
        }
      }
    };

    fetchGame();
  }, [contract, joinedGameId]);

  const createGame = async () => {
    if (contract) {
      try {
        await contract.createGame(opponent);
        const gameId = await contract.playerToGame(account);
        setGameId(gameId.toString());
      } catch (error) {
        console.error("Error creating game:", error);
      }
    }
  };

  const joinGame = async () => {
    if (contract && joinedGameId) {
      try {
        await contract.joinGame(joinedGameId);
        const game = await contract.getGame(joinedGameId);
        setGame({
          player1: game.player1,
          player2: game.player2,
          player1Move: game.player1Move,
          player2Move: game.player2Move,
          result: game.result,
          player2Joined: game.player2Joined,
        });
        // Ensure the player's address is correctly mapped to the game ID
        const gameId = await contract.playerToGame(account);
        setGameId(gameId.toString());
      } catch (error) {
        console.error("Error joining game:", error);
      }
    }
  };

  const playMove = async () => {
    if (contract && joinedGameId) {
      try {
        const moveEnum = parseInt(move, 10); // Ensure move is a number
        await contract.playMove(moveEnum);
        const game = await contract.getGame(joinedGameId);
        setGame({
          player1: game.player1,
          player2: game.player2,
          player1Move: game.player1Move,
          player2Move: game.player2Move,
          result: game.result,
          player2Joined: game.player2Joined,
        });
        setResult(game.result);
      } catch (error) {
        console.error("Error playing move:", error);
      }
    }
  };

  const renderResult = () => {
    if (result === 0) {
      return "Pending";
    } else if (result === 1) {
      return `Player 1 (Address: ${game.player1}) Wins`;
    } else if (result === 2) {
      return `Player 2 (Address: ${game.player2}) Wins`;
    } else {
      return "Draw";
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12 bg-gray-100">
      <Navbar />
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Rock, Paper, Scissors
        </h1>
        <p className="text-lg mb-4">Account: {account}</p>
        <div className="mb-4">
          <input
            className="border p-2 rounded w-full"
            type="text"
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
            placeholder="Opponent Address"
          />
          <button
            className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            onClick={createGame}
          >
            Create Game
          </button>
        </div>
        {gameId && (
          <div className="mb-4">
            <p className="text-green-500">
              Game created! Share this ID with your opponent:{" "}
              <strong>{gameId}</strong>
            </p>
          </div>
        )}
        <div className="mb-4">
          <input
            className="border p-2 rounded w-full"
            type="text"
            value={joinedGameId}
            onChange={(e) => setJoinedGameId(e.target.value)}
            placeholder="Enter Game ID to Join"
          />
          <button
            className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            onClick={joinGame}
          >
            Join Game
          </button>
        </div>
        {joinedGameId && game && !game.player2Joined && (
          <div className="mb-4">
            <p className="text-yellow-500">Waiting for opponent to join...</p>
            <p>Game ID: {joinedGameId}</p>
          </div>
        )}
        {game?.player2Joined && (
          <div className="mb-4">
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(moveImages).map(([key, src]) => (
                <div
                  key={key}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    move === key ? "border-blue-500" : ""
                  }`}
                  onClick={() => setMove(key)}
                >
                  <img
                    src={src}
                    alt={`Move ${key}`}
                    className="w-full h-32 object-cover"
                  />
                  <p className="text-center mt-2">
                    {["", "Rock", "Paper", "Scissors"][key]}
                  </p>
                </div>
              ))}
            </div>
            <button
              className="mt-4 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
              onClick={playMove}
            >
              Play Move
            </button>
          </div>
        )}
        {result !== null && (
          <div className="mt-4 p-4 bg-gray-200 rounded">
            <p className="text-xl font-bold">Result: {renderResult()}</p>
          </div>
        )}
      </div>
    </main>
  );
}
