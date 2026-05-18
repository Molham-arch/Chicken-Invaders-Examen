const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

const startButton = document.querySelector("#startButton");
const statusText = document.querySelector("#statusText");
const pressedKeys = new Set();

const game = {
  started: false,
  score: 0,
  health: 3,
  level: 1,
  timeLeft: 180,
  lastTime: 0,
  player: {
    x: canvas.width / 2,
    y: canvas.height - 90,
    width: 70,
    height: 52,
    speed: 430,
  },
};

const assets = {
  background: loadImage("assets/sprites/background.png"),
  ship: loadImage("assets/sprites/spaceship.png"),
  chicken: loadImage("assets/sprites/chicken.png"),
};

function loadImage(src) {
  const image = new Image();
  image.src = src;
  return image;
}

function drawBackground() {
  if (assets.background.complete) {
    ctx.drawImage(assets.background, 0, 0, canvas.width, canvas.height);
    return;
  }

  ctx.fillStyle = "#21125c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawHud() {
  ctx.fillStyle = "white";
  ctx.font = "bold 28px Arial";
  ctx.fillText(`Score: ${game.score}`, 40, 58);
  ctx.fillText(`Health: ${game.health}`, 40, 98);
  ctx.fillText(`Time: 3:00`, 40, 138);

  ctx.fillStyle = "#35ff28";
  ctx.fillText(`*Level ${game.level}*`, 40, canvas.height - 34);
}

function drawPlayer() {
  const { player } = game;

  if (assets.ship.complete) {
    ctx.drawImage(
      assets.ship,
      player.x - player.width / 2,
      player.y - player.height / 2,
      player.width,
      player.height
    );
    return;
  }

  ctx.fillStyle = "white";
  ctx.fillRect(player.x - 25, player.y - 25, 50, 50);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function updatePlayer(deltaTime) {
  if (!game.started) return;

  const { player } = game;
  let directionX = 0;
  let directionY = 0;

  if (pressedKeys.has("arrowleft") || pressedKeys.has("a")) directionX -= 1;
  if (pressedKeys.has("arrowright") || pressedKeys.has("d")) directionX += 1;
  if (pressedKeys.has("arrowup") || pressedKeys.has("w")) directionY -= 1;
  if (pressedKeys.has("arrowdown") || pressedKeys.has("s")) directionY += 1;

  // Normalize diagonal movement so moving sideways and diagonally has the same speed.
  const length = Math.hypot(directionX, directionY) || 1;
  player.x += (directionX / length) * player.speed * deltaTime;
  player.y += (directionY / length) * player.speed * deltaTime;

  player.x = clamp(player.x, player.width / 2, canvas.width - player.width / 2);
  player.y = clamp(player.y, canvas.height * 0.45, canvas.height - player.height / 2);
}

function drawEnemyPreview() {
  if (!assets.chicken.complete) return;

  for (let i = 0; i < 5; i += 1) {
    ctx.drawImage(assets.chicken, 380 + i * 110, 80, 74, 60);
  }
}

function drawStartText() {
  if (game.started) return;

  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "bold 46px Arial";
  ctx.fillText("Chicken Invaders", canvas.width / 2, canvas.height / 2 - 20);
  ctx.font = "24px Arial";
  ctx.fillText("Starter version: movement, shooting and enemies will be added next.", canvas.width / 2, canvas.height / 2 + 26);
  ctx.textAlign = "left";
}

function render() {
  drawBackground();
  drawHud();
  drawEnemyPreview();
  drawPlayer();
  drawStartText();
}

function gameLoop(currentTime) {
  const deltaTime = Math.min(0.033, (currentTime - game.lastTime) / 1000 || 0);
  game.lastTime = currentTime;

  updatePlayer(deltaTime);
  render();
  requestAnimationFrame(gameLoop);
}

startButton.addEventListener("click", () => {
  game.started = true;
  statusText.textContent = "Move with WASD or arrow keys. Next step: add shooting.";
});

window.addEventListener("keydown", (event) => {
  pressedKeys.add(event.key.toLowerCase());

  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) {
    event.preventDefault();
  }
});

window.addEventListener("keyup", (event) => {
  pressedKeys.delete(event.key.toLowerCase());
});

requestAnimationFrame(gameLoop);
