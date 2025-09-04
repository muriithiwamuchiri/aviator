const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

let players = [];
let crashPoint = 0;
let multiplier = 1;
let gameState = 'waiting'; // waiting, running, crashed

function startGameRound() {
  crashPoint = +(Math.random() * 99 + 1).toFixed(2); // 1.00 to 100.00x
  multiplier = 1;
  gameState = 'running';
  players.forEach(p => { p.status = 'playing'; p.cashOutMultiplier = null; });

  const interval = setInterval(() => {
    multiplier += 0.05;
    players.forEach(p => {
      if (p.status === 'playing' && multiplier >= crashPoint) {
        p.status = 'crashed';
      }
    });
    if (multiplier >= crashPoint) {
      gameState = 'crashed';
      io.emit('game_update', { crashPoint, multiplier, players, gameState });
      clearInterval(interval);
      setTimeout(() => {
        players = players.filter(p => p.status === 'cashed');
        gameState = 'waiting';
        io.emit('game_update', { crashPoint, multiplier, players, gameState });
        setTimeout(startGameRound, 2000);
      }, 3000);
    } else {
      io.emit('game_update', { crashPoint, multiplier, players, gameState });
    }
  }, 100);
}

io.on('connection', socket => {
  socket.on('place_bet', ({ amount }) => {
    if (gameState === 'waiting') {
      players.push({ id: socket.id, name: `Player${players.length + 1}`, bet: amount, status: 'playing', cashOutMultiplier: null });
      io.emit('game_update', { crashPoint, multiplier, players, gameState });
    }
  });

  socket.on('cash_out', () => {
    let player = players.find(p => p.id === socket.id && p.status === 'playing');
    if (player && gameState === 'running') {
      player.status = 'cashed';
      player.cashOutMultiplier = multiplier;
      io.emit('game_update', { crashPoint, multiplier, players, gameState });
    }
  });

  socket.on('disconnect', () => {
    players = players.filter(p => p.id !== socket.id);
    io.emit('game_update', { crashPoint, multiplier, players, gameState });
  });
});

server.listen(4000, () => {
  console.log('Aviator server running on port 4000');
  setTimeout(startGameRound, 2000);
});
