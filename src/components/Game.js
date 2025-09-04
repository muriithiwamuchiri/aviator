import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import BetControls from './BetControls';
import Leaderboard from './Leaderboard';

const socket = io('http://localhost:4000');

function Game() {
  const [crashPoint, setCrashPoint] = useState(null);
  const [multiplier, setMultiplier] = useState(1);
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState('waiting');

  useEffect(() => {
    socket.on('game_update', ({ crashPoint, multiplier, players, gameState }) => {
      setCrashPoint(crashPoint);
      setMultiplier(multiplier);
      setPlayers(players);
      setGameState(gameState);
    });
    return () => socket.off('game_update');
  }, []);

  return (
    <div className="game-green">
      <h1>🛩️ Aviator Crash Game</h1>
      <div className="crash-display">
        <span>Multiplier: {multiplier.toFixed(2)}x</span>
        {gameState === 'crashed' && <span className="crashed">CRASHED at {crashPoint.toFixed(2)}x</span>}
      </div>
      <BetControls socket={socket} gameState={gameState} />
      <Leaderboard players={players} />
    </div>
  );
}

export default Game;