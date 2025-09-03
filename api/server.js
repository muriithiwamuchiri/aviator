const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let gameState = {
  multiplier: 1.0,
  active: false,
  crashed: false
};

function runGameLoop() {
  if (gameState.active) return;
  gameState.active = true;
  gameState.crashed = false;
  gameState.multiplier = 1.0;
  let interval = setInterval(() => {
    if (gameState.crashed) return clearInterval(interval);
    gameState.multiplier += Math.random() * 0.05;
    if (Math.random() < 0.02 || gameState.multiplier > 50) {
      gameState.crashed = true;
      gameState.active = false;
      clearInterval(interval);
    }
  }, 100);
}

setInterval(runGameLoop, 5000);

app.get('/api/state', (req, res) => {
  res.json(gameState);
});

app.post('/api/cashout', (req, res) => {
  if (gameState.crashed) {
    return res.json({ success: false, message: 'Game crashed!' });
  }
  res.json({ success: true, multiplier: gameState.multiplier });
});

app.listen(3000, () => {
  console.log('Aviator server running on port 3000');
});
