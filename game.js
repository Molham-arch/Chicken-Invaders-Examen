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
  bullets: [],
  enemies: [],
  enemyDirection: 1,
  player: {
    x: canvas.width / 2,
    y: canvas.height - 90,
    width: 70,
    height: 52,
    speed: 430,
    shootCooldown: 0,
  },
};

const assets = {
  background: loadImage("assets/sprites/background.png"),
  ship: loadImage("assets/sprites/spaceship.png"),
  chicken: loadImage("assets/sprites/chicken.png"),
  bullet: loadImage("assets/sprites/bullet.png"),
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

function drawBullets() {
  for (const bullet of game.bullets) {
    if (assets.bullet.complete) {
      ctx.drawImage(
        assets.bullet,
        bullet.x - bullet.width / 2,
        bullet.y - bullet.height / 2,
        bullet.width,
        bullet.height
      );
    } else {
      ctx.fillStyle = "white";
      ctx.fillRect(bullet.x - 4, bullet.y - 14, 8, 28);
    }
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function updatePlayer(deltaTime) {
  if (!game.started) return;

  const { player } = game;
  player.shootCooldown = Math.max(0, player.shootCooldown - deltaTime);

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

function shootBullet() {
  const { player } = game;
  if (!game.started || player.shootCooldown > 0) return;

  game.bullets.push({
    x: player.x,
    y: player.y - player.height / 2,
    width: 14,
    height: 28,
    speed: 700,
  });

  player.shootCooldown = 0.22;
}

function updateBullets(deltaTime) {
  for (const bullet of game.bullets) {
    bullet.y -= bullet.speed * deltaTime;
  }

  game.bullets = game.bullets.filter((bullet) => bullet.y + bullet.height > 0);
}

function createEnemyWave() {
  game.enemies = [];

  const columns = 6;
  const startX = canvas.width / 2 - ((columns - 1) * 110) / 2;

  for (let i = 0; i < columns; i += 1) {
    game.enemies.push({
      x: startX + i * 110,
      y: 96,
      width: 74,
      height: 60,
      speed: 80,
    });
  }
}

function updateEnemies(deltaTime) {
  if (!game.started || game.enemies.length === 0) return;

  let shouldTurn = false;

  for (const enemy of game.enemies) {
    enemy.x += game.enemyDirection * enemy.speed * deltaTime;

    if (enemy.x < enemy.width / 2 || enemy.x > canvas.width - enemy.width / 2) {
      shouldTurn = true;
    }
  }

  if (shouldTurn) {
    game.enemyDirection *= -1;

    for (const enemy of game.enemies) {
      enemy.y += 18;
    }
  }
}

function drawEnemies() {
  for (const enemy of game.enemies) {
    if (assets.chicken.complete) {
      ctx.drawImage(
        assets.chicken,
        enemy.x - enemy.width / 2,
        enemy.y - enemy.height / 2,
        enemy.width,
        enemy.height
      );
    } else {
      ctx.fillStyle = "#ffdf5d";
      ctx.fillRect(enemy.x - 30, enemy.y - 24, 60, 48);
    }
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
  drawEnemies();
  drawBullets();
  drawPlayer();
  drawStartText();
}

function gameLoop(currentTime) {
  const deltaTime = Math.min(0.033, (currentTime - game.lastTime) / 1000 || 0);
  game.lastTime = currentTime;

  updatePlayer(deltaTime);
  updateBullets(deltaTime);
  updateEnemies(deltaTime);
  render();
  requestAnimationFrame(gameLoop);
}

startButton.addEventListener("click", () => {
  game.started = true;
  createEnemyWave();
  statusText.textContent = "Enemy wave spawned. Next step: bullet collisions.";
});

window.addEventListener("keydown", (event) => {
  pressedKeys.add(event.key.toLowerCase());

  if (event.key === " ") {
    shootBullet();
  }

  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) {
    event.preventDefault();
  }
});

window.addEventListener("keyup", (event) => {
  pressedKeys.delete(event.key.toLowerCase());
});

requestAnimationFrame(gameLoop);
