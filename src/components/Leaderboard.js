import React from 'react';

function Leaderboard({ players }) {
  return (
    <div className="leaderboard-green">
      <h2>Live Players</h2>
      <ul>
        {players.map((p, i) => (
          <li key={i}>
            {p.name}: {p.bet} {p.status === 'cashed' ? `💸 Cashed @ ${p.cashOutMultiplier?.toFixed(2)}x` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Leaderboard;