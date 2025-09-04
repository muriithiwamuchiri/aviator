import React, { useState } from 'react';

function BetControls({ socket, gameState }) {
  const [bet, setBet] = useState('');

  const placeBet = () => {
    if (bet > 0 && gameState === 'waiting') {
      socket.emit('place_bet', { amount: Number(bet) });
      setBet('');
    }
  };

  const cashOut = () => {
    socket.emit('cash_out');
  };

  return (
    <div className="bet-controls-green">
      <input
        type="number"
        value={bet}
        min="1"
        placeholder="Bet Amount"
        onChange={e => setBet(e.target.value)}
        disabled={gameState !== 'waiting'}
      />
      <button className="green-btn" onClick={placeBet} disabled={gameState !== 'waiting'}>
        Place Bet
      </button>
      <button className="green-btn" onClick={cashOut} disabled={gameState !== 'running'}>
        Cash Out
      </button>
    </div>
  );
}

export default BetControls;
