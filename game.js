const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElem = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOverScreen');
const restartBtn = document.getElementById('restartBtn');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const playerWidth = 80;
const playerHeight = 15;
const playerY = canvasHeight - playerHeight - 10;
let playerX = (canvasWidth - playerWidth) / 2;

const objectSize = 20;
let objects = [];

let score = 0;
let gameRunning = false;

let keysPressed = {
  left: false,
  right: false
};

function resetGame() {
  score = 0;
  objects = [];
  playerX = (canvasWidth - playerWidth) / 2;
  gameOverScreen.style.display = 'none';
  scoreElem.textContent = 'Score: 0';
  gameRunning = true;
  spawnObject();
  gameLoop();
}

// Spawn a new falling object at random x position
function spawnObject() {
  const x = Math.random() * (canvasWidth - objectSize);
  objects.push({ x, y: -objectSize, speed: 2 + Math.random() * 2 });
}

// Draw player basket
function drawPlayer() {
  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
  // Draw basket rim
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(playerX, playerY);
  ctx.lineTo(playerX + playerWidth, playerY);
  ctx.stroke();
}

// Draw the falling objects
function drawObjects() {
  ctx.fillStyle = '#FFC107';
  objects.forEach(obj => {
    ctx.beginPath();
    ctx.arc(obj.x + objectSize / 2, obj.y + objectSize / 2, objectSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#bf8f00';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

// Update positions and check collisions
function update() {
  // Move player
  if (keysPressed.left) {
    playerX -= 6;
    if (playerX < 0) playerX = 0;
  }
  if (keysPressed.right) {
    playerX += 6;
    if (playerX + playerWidth > canvasWidth) playerX = canvasWidth - playerWidth;
  }

  // Move objects
  for (let i = 0; i < objects.length; i++) {
    let obj = objects[i];
    obj.y += obj.speed;

    // Check if object caught by player
    if (
      obj.y + objectSize >= playerY &&
      obj.x + objectSize >= playerX &&
      obj.x <= playerX + playerWidth
    ) {
      // Caught
      score++;
      scoreElem.textContent = 'Score: ' + score;
      objects.splice(i, 1);
      i--;
      // Spawn new object on catch
      spawnObject();
    }
    // Check if object missed bottom
    else if (obj.y > canvasHeight) {
      // Game over
      gameRunning = false;
      gameOverScreen.style.display = 'block';
      return;
    }
  }
}

// Clear and redraw canvas
function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawPlayer();
  drawObjects();
}

// Main game loop
function gameLoop() {
  if (!gameRunning) return;
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Keyboard events
window.addEventListener('keydown', e => {
  if (e.code === 'ArrowLeft' || e.key === 'ArrowLeft') {
    keysPressed.left = true;
  }
  if (e.code === 'ArrowRight' || e.key === 'ArrowRight') {
    keysPressed.right = true;
  }
});

window.addEventListener('keyup', e => {
  if (e.code === 'ArrowLeft' || e.key === 'ArrowLeft') {
    keysPressed.left = false;
  }
  if (e.code === 'ArrowRight' || e.key === 'ArrowRight') {
    keysPressed.right = false;
  }
});

restartBtn.addEventListener('click', () => {
  resetGame();
});

// Start the game initially
resetGame();