const minutesInput = document.getElementById("minutes-per-player");
const setChessBtn = document.getElementById("set-chess");
const startChessBtn = document.getElementById("start-chess");
const pauseChessBtn = document.getElementById("pause-chess");
const resetChessBtn = document.getElementById("reset-chess");
const playerOneBtn = document.getElementById("player-one");
const playerTwoBtn = document.getElementById("player-two");
const playerOneTime = document.getElementById("player-one-time");
const playerTwoTime = document.getElementById("player-two-time");
const chessStatus = document.getElementById("chess-status");

let baseSeconds = Number(minutesInput.value) * 60;
let p1 = baseSeconds;
let p2 = baseSeconds;
let activePlayer = 1;
let chessRunning = false;
let lastTick = 0;
let chessTimer = null;

function formatChess(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function renderChess() {
  playerOneTime.textContent = formatChess(p1);
  playerTwoTime.textContent = formatChess(p2);
  playerOneBtn.classList.toggle("active", chessRunning && activePlayer === 1);
  playerTwoBtn.classList.toggle("active", chessRunning && activePlayer === 2);
  playerOneBtn.classList.toggle("flagged", p1 <= 0);
  playerTwoBtn.classList.toggle("flagged", p2 <= 0);
}

function stopChess(message) {
  chessRunning = false;
  clearInterval(chessTimer);
  chessTimer = null;
  chessStatus.textContent = message;
  renderChess();
}

function tickChess() {
  if (!chessRunning) {
    return;
  }

  const now = performance.now();
  const delta = (now - lastTick) / 1000;
  lastTick = now;

  if (activePlayer === 1) {
    p1 = Math.max(0, p1 - delta);
    if (p1 <= 0) {
      stopChess("Player 1 flagged. Player 2 wins on time!");
      return;
    }
  } else {
    p2 = Math.max(0, p2 - delta);
    if (p2 <= 0) {
      stopChess("Player 2 flagged. Player 1 wins on time!");
      return;
    }
  }

  renderChess();
}

function setChessTime() {
  const minutes = Number(minutesInput.value);
  if (!Number.isFinite(minutes) || minutes < 1) {
    chessStatus.textContent = "Please enter a valid minute value.";
    return;
  }
  baseSeconds = minutes * 60;
  p1 = baseSeconds;
  p2 = baseSeconds;
  activePlayer = 1;
  stopChess(`Clock set to ${minutes} minutes per player.`);
}

setChessBtn.addEventListener("click", setChessTime);

startChessBtn.addEventListener("click", () => {
  if (chessRunning) {
    return;
  }
  chessRunning = true;
  lastTick = performance.now();
  chessTimer = setInterval(tickChess, 100);
  chessStatus.textContent = `Running. Player ${activePlayer} to move.`;
  renderChess();
});

pauseChessBtn.addEventListener("click", () => {
  if (!chessRunning) {
    return;
  }
  stopChess("Paused.");
});

resetChessBtn.addEventListener("click", () => {
  p1 = baseSeconds;
  p2 = baseSeconds;
  activePlayer = 1;
  stopChess("Reset complete. Press Start to begin.");
});

function switchPlayer(player) {
  if (!chessRunning || activePlayer !== player) {
    return;
  }
  activePlayer = player === 1 ? 2 : 1;
  chessStatus.textContent = `Running. Player ${activePlayer} to move.`;
  renderChess();
}

playerOneBtn.addEventListener("click", () => switchPlayer(1));
playerTwoBtn.addEventListener("click", () => switchPlayer(2));

renderChess();
