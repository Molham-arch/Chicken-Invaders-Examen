const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

const startButton = document.querySelector("#startButton");
const statusText = document.querySelector("#statusText");
const pressedKeys = new Set();

const game = {
  state: "menu",
  score: 0,
  health: 3,
  level: 1,
  timeLeft: 180,
  lastTime: 0,
  bullets: [],
  eggs: [],
  enemies: [],
  enemyDirection: 1,
  enemyShootTimer: 1.5,
  player: {
    x: canvas.width / 2,
    y: canvas.height - 90,
    width: 70,
    height: 52,
    speed: 430,
    shootCooldown: 0,
    invincibleTimer: 0,
  },
};

const assets = {
  background: loadImage("assets/sprites/background.png"),
  ship: loadImage("assets/sprites/spaceship.png"),
  chicken: loadImage("assets/sprites/chicken.png"),
  bullet: loadImage("assets/sprites/bullet.png"),
  egg: loadImage("assets/sprites/egg.png"),
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
  const safeTime = Math.ceil(game.timeLeft);
  const minutes = Math.floor(safeTime / 60);
  const seconds = (safeTime % 60).toString().padStart(2, "0");

  ctx.fillStyle = "white";
  ctx.font = "bold 28px Arial";
  ctx.fillText(`Score: ${game.score}`, 40, 58);
  ctx.fillText(`Health: ${game.health}`, 40, 98);
  ctx.fillText(`Time: ${minutes}:${seconds}`, 40, 138);

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

function drawEggs() {
  for (const egg of game.eggs) {
    if (assets.egg.complete) {
      ctx.drawImage(
        assets.egg,
        egg.x - egg.width / 2,
        egg.y - egg.height / 2,
        egg.width,
        egg.height
      );
    } else {
      ctx.fillStyle = "#fff6c7";
      ctx.beginPath();
      ctx.ellipse(egg.x, egg.y, egg.width / 2, egg.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function updatePlayer(deltaTime) {
  if (game.state !== "playing") return;

  const { player } = game;
  player.shootCooldown = Math.max(0, player.shootCooldown - deltaTime);
  player.invincibleTimer = Math.max(0, player.invincibleTimer - deltaTime);

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
  if (game.state !== "playing" || player.shootCooldown > 0) return;

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

function updateEggs(deltaTime) {
  for (const egg of game.eggs) {
    egg.y += egg.speed * deltaTime;
  }

  game.eggs = game.eggs.filter((egg) => egg.y - egg.height / 2 < canvas.height);
}

function objectsOverlap(first, second) {
  return (
    Math.abs(first.x - second.x) < (first.width + second.width) / 2 &&
    Math.abs(first.y - second.y) < (first.height + second.height) / 2
  );
}

function checkBulletEnemyCollisions() {
  for (let bulletIndex = game.bullets.length - 1; bulletIndex >= 0; bulletIndex -= 1) {
    const bullet = game.bullets[bulletIndex];

    for (let enemyIndex = game.enemies.length - 1; enemyIndex >= 0; enemyIndex -= 1) {
      const enemy = game.enemies[enemyIndex];

      if (!objectsOverlap(bullet, enemy)) continue;

      game.bullets.splice(bulletIndex, 1);
      game.enemies.splice(enemyIndex, 1);
      game.score += game.level === 1 ? 100 : 150;
      break;
    }
  }
}

function createEnemyWave() {
  game.enemies = [];

  const columns = game.level === 1 ? 6 : 7;
  const rows = game.level === 1 ? 1 : 2;
  const gapX = 110;
  const gapY = 76;
  const startX = canvas.width / 2 - ((columns - 1) * gapX) / 2;
  const startY = game.level === 1 ? 96 : 74;

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      game.enemies.push({
        x: startX + column * gapX,
        y: startY + row * gapY,
        width: 74,
        height: 60,
        speed: game.level === 1 ? 80 : 105,
      });
    }
  }
}

function updateEnemies(deltaTime) {
  if (game.state !== "playing" || game.enemies.length === 0) return;

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

  game.enemyShootTimer -= deltaTime;

  if (game.enemyShootTimer <= 0) {
    const shooter = game.enemies[Math.floor(Math.random() * game.enemies.length)];
    game.eggs.push({
      x: shooter.x,
      y: shooter.y + shooter.height / 2,
      width: 24,
      height: 32,
      speed: game.level === 1 ? 210 : 260,
    });
    game.enemyShootTimer = game.level === 1 ? 1.2 : 0.85;
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
  if (game.state === "playing") return;

  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "bold 46px Arial";
  const title = game.state === "won" ? "You Win!" : game.state === "lost" ? "Game Over" : "Chicken Invaders";
  ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 20);
  ctx.font = "24px Arial";
  const message =
    game.state === "won"
      ? `Final score: ${game.score}. Press Start to play again.`
      : game.state === "lost"
        ? `Time is over. Final score: ${game.score}. Press Start to retry.`
        : "Starter version: movement, shooting and enemies will be added next.";
  ctx.fillText(message, canvas.width / 2, canvas.height / 2 + 26);
  ctx.textAlign = "left";
}

function checkEggPlayerCollisions() {
  if (game.player.invincibleTimer > 0) return;

  for (let eggIndex = game.eggs.length - 1; eggIndex >= 0; eggIndex -= 1) {
    const egg = game.eggs[eggIndex];

    if (!objectsOverlap(egg, game.player)) continue;

    game.eggs.splice(eggIndex, 1);
    game.health -= 1;
    game.player.invincibleTimer = 1.2;
    statusText.textContent = `Player hit. Health left: ${game.health}.`;
    break;
  }
}

function resetGame() {
  game.state = "playing";
  game.score = 0;
  game.health = 3;
  game.level = 1;
  game.timeLeft = 180;
  game.bullets = [];
  game.eggs = [];
  game.enemyDirection = 1;
  game.enemyShootTimer = 1.5;
  game.player.x = canvas.width / 2;
  game.player.y = canvas.height - 90;
  game.player.shootCooldown = 0;
  game.player.invincibleTimer = 0;
  createEnemyWave();
}

function startNextLevel() {
  game.level += 1;
  game.timeLeft = 150;
  game.bullets = [];
  game.eggs = [];
  game.enemyDirection = 1;
  game.enemyShootTimer = 1;
  game.player.x = canvas.width / 2;
  game.player.y = canvas.height - 90;
  game.player.shootCooldown = 0;
  game.player.invincibleTimer = 0.8;
  createEnemyWave();
  statusText.textContent = "Level 2 started. Faster enemies and more eggs.";
}

function updateGameState(deltaTime) {
  if (game.state !== "playing") return;

  game.timeLeft = Math.max(0, game.timeLeft - deltaTime);

  if (game.enemies.length === 0 && game.level === 1) {
    startNextLevel();
    return;
  }

  if (game.enemies.length === 0 && game.level === 2) {
    game.state = "won";
    startButton.textContent = "Play Again";
    statusText.textContent = "You completed both levels. You can restart the game.";
  }

  if (game.timeLeft <= 0) {
    game.state = "lost";
    startButton.textContent = "Try Again";
    statusText.textContent = "Time is over. Restart and try to clear the wave faster.";
  }

  if (game.health <= 0) {
    game.state = "lost";
    startButton.textContent = "Try Again";
    statusText.textContent = "Health is 0. Restart and dodge the eggs.";
  }
}

function render() {
  drawBackground();
  drawHud();
  drawEnemies();
  drawBullets();
  drawEggs();
  drawPlayer();
  drawStartText();
}

function gameLoop(currentTime) {
  const deltaTime = Math.min(0.033, (currentTime - game.lastTime) / 1000 || 0);
  game.lastTime = currentTime;

  updatePlayer(deltaTime);
  updateBullets(deltaTime);
  updateEggs(deltaTime);
  updateEnemies(deltaTime);
  checkBulletEnemyCollisions();
  checkEggPlayerCollisions();
  updateGameState(deltaTime);
  render();
  requestAnimationFrame(gameLoop);
}

startButton.addEventListener("click", () => {
  resetGame();
  startButton.textContent = "Restart";
  statusText.textContent = "Clear the wave before the timer reaches zero.";
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
