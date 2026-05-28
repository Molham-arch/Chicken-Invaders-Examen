const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

const menuOverlay = document.querySelector("#menuOverlay");
const menuTitle = document.querySelector("#menuTitle");
const mainPanel = document.querySelector("#mainPanel");
const levelPanel = document.querySelector("#levelPanel");
const startButton = document.querySelector("#startButton");
const continueButton = document.querySelector("#continueButton");
const optionsButton = document.querySelector("#optionsButton");
const exitButton = document.querySelector("#exitButton");
const optionsPanel = document.querySelector("#optionsPanel");
const volumeSlider = document.querySelector("#volumeSlider");
const difficultySelect = document.querySelector("#difficultySelect");
const backButton = document.querySelector("#backButton");
const levelBackButton = document.querySelector("#levelBackButton");
const levelButtons = document.querySelectorAll("[data-level]");
const statusText = document.querySelector("#statusText");
const pressedKeys = new Set();
const sloganText = "Wij lanceren je de toekomst in!";
const creditText = "Developed by Molham Alam";

// Pointer is used for mouse and touch movement.
const pointer = {
  active: false,
  isDown: false,
  x: canvas.width / 2,
  y: canvas.height - 90,
};

// Central game state. Most functions read or update this object.
const game = {
  state: "menu",
  score: 0,
  health: 3,
  level: 1,
  timeLeft: 180,
  lastTime: 0,
  bullets: [],
  eggs: [],
  powerups: [],
  enemies: [],
  enemyDirection: 1,
  enemyShootTimer: 1.5,
  difficulty: "normal",
  volume: 0.45,
  player: {
    x: canvas.width / 2,
    y: canvas.height - 90,
    width: 70,
    height: 52,
    speed: 430,
    shootCooldown: 0,
    invincibleTimer: 0,
    powerTimer: 0,
  },
};

// Image assets are loaded once and then reused while drawing the canvas.
const assets = {
  background: loadImage("assets/sprites/background.png"),
  ship: loadImage("assets/sprites/spaceship.png"),
  chicken: loadImage("assets/sprites/chicken.png"),
  bullet: loadImage("assets/sprites/bullet.png"),
  egg: loadImage("assets/sprites/egg.png"),
  power: loadImage("assets/sprites/hero.png"),
  brandLogo: loadImage("assets/Bijlage 2 - Logos/Bijlage 2 - Logo zonder text.png"),
};

// Audio assets are controlled through the volume slider in the options menu.
const sounds = {
  music: loadAudio("assets/audio/Background.mp3", true),
  shoot: loadAudio("assets/audio/Shoot.ogg"),
  hit: loadAudio("assets/audio/chicken-die.ogg"),
  damage: loadAudio("assets/audio/Explosion.mp3"),
  power: loadAudio("assets/audio/Power-Up.wav"),
  victory: loadAudio("assets/audio/victory.wav"),
};

function loadImage(src) {
  const image = new Image();
  image.src = src;
  return image;
}

function loadAudio(src, loop = false) {
  const audio = new Audio(src);
  audio.loop = loop;
  return audio;
}

function setVolume(value) {
  game.volume = value;

  for (const sound of Object.values(sounds)) {
    sound.volume = value;
  }
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(() => {
    // Browsers only allow audio after a user interaction.
    statusText.textContent = "Click Start Game once to enable browser audio.";
  });
}

function startMusic() {
  sounds.music.play().catch(() => {
    statusText.textContent = "Click Start Game once to enable music.";
  });
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

  if (game.player.powerTimer > 0) {
    ctx.fillStyle = "#ffe95d";
    ctx.font = "bold 22px Arial";
    ctx.fillText(`Triple Shot: ${game.player.powerTimer.toFixed(1)}s`, 40, 178);
  }

  ctx.save();
  ctx.textAlign = "right";

  if (assets.brandLogo.complete) {
    const logoSize = 58;
    ctx.drawImage(assets.brandLogo, canvas.width - logoSize - 40, 22, logoSize, logoSize);
  }

  ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
  ctx.font = "bold 20px Arial";
  ctx.fillText("Best Education", canvas.width - 40, 98);
  ctx.fillStyle = "#d7a7ff";
  ctx.shadowColor = "rgba(178, 92, 255, 0.65)";
  ctx.shadowBlur = 14;
  ctx.font = "italic bold 18px Georgia";
  ctx.fillText(creditText, canvas.width - 40, 124);
  ctx.fillStyle = "#f0dcff";
  ctx.font = "italic bold 16px Georgia";
  ctx.fillText(sloganText, canvas.width - 40, 150);
  ctx.restore();
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

function drawPowerups() {
  for (const powerup of game.powerups) {
    if (assets.power.complete) {
      ctx.drawImage(
        assets.power,
        powerup.x - powerup.width / 2,
        powerup.y - powerup.height / 2,
        powerup.width,
        powerup.height
      );
    } else {
      ctx.fillStyle = "#ffe95d";
      ctx.beginPath();
      ctx.arc(powerup.x, powerup.y, powerup.width / 2, 0, Math.PI * 2);
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
  player.powerTimer = Math.max(0, player.powerTimer - deltaTime);

  let directionX = 0;
  let directionY = 0;

  if (pressedKeys.has("arrowleft") || pressedKeys.has("a")) directionX -= 1;
  if (pressedKeys.has("arrowright") || pressedKeys.has("d")) directionX += 1;
  if (pressedKeys.has("arrowup") || pressedKeys.has("w")) directionY -= 1;
  if (pressedKeys.has("arrowdown") || pressedKeys.has("s")) directionY += 1;

  const hasKeyboardMovement = directionX !== 0 || directionY !== 0;

  // Mouse/touch movement follows the pointer when no keyboard key is pressed.
  if (!hasKeyboardMovement && pointer.active) {
    const followSpeed = Math.min(1, deltaTime * 14);
    player.x += (pointer.x - player.x) * followSpeed;
    player.y += (pointer.y - player.y) * followSpeed;

    player.x = clamp(player.x, player.width / 2, canvas.width - player.width / 2);
    player.y = clamp(player.y, canvas.height * 0.45, canvas.height - player.height / 2);

    if (pointer.isDown) {
      shootBullet();
    }

    return;
  }

  if (hasKeyboardMovement) {
    pointer.active = false;
  }

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

  // The power-up temporarily changes one bullet into three bullets.
  const offsets = player.powerTimer > 0 ? [-22, 0, 22] : [0];

  for (const offset of offsets) {
    game.bullets.push({
      x: player.x + offset,
      y: player.y - player.height / 2,
      width: 14,
      height: 28,
      speed: 700,
    });
  }

  player.shootCooldown = 0.22;
  playSound(sounds.shoot);
}

function updateBullets(deltaTime) {
  if (game.state !== "playing") return;

  for (const bullet of game.bullets) {
    bullet.y -= bullet.speed * deltaTime;
  }

  game.bullets = game.bullets.filter((bullet) => bullet.y + bullet.height > 0);
}

function updateEggs(deltaTime) {
  if (game.state !== "playing") return;

  for (const egg of game.eggs) {
    egg.y += egg.speed * deltaTime;
  }

  game.eggs = game.eggs.filter((egg) => egg.y - egg.height / 2 < canvas.height);
}

function updatePowerups(deltaTime) {
  if (game.state !== "playing") return;

  for (const powerup of game.powerups) {
    powerup.y += powerup.speed * deltaTime;
  }

  game.powerups = game.powerups.filter((powerup) => powerup.y - powerup.height / 2 < canvas.height);
}

function objectsOverlap(first, second) {
  // Simple rectangle collision works well for this 2D arcade game.
  return (
    Math.abs(first.x - second.x) < (first.width + second.width) / 2 &&
    Math.abs(first.y - second.y) < (first.height + second.height) / 2
  );
}

function checkBulletEnemyCollisions() {
  if (game.state !== "playing") return;

  // Loop backwards because objects are removed from the arrays after a hit.
  for (let bulletIndex = game.bullets.length - 1; bulletIndex >= 0; bulletIndex -= 1) {
    const bullet = game.bullets[bulletIndex];

    for (let enemyIndex = game.enemies.length - 1; enemyIndex >= 0; enemyIndex -= 1) {
      const enemy = game.enemies[enemyIndex];

      if (!objectsOverlap(bullet, enemy)) continue;

      game.bullets.splice(bulletIndex, 1);
      game.enemies.splice(enemyIndex, 1);
      game.score += game.level === 1 ? 100 : 150;
      maybeDropPowerup(enemy.x, enemy.y);
      playSound(sounds.hit);
      break;
    }
  }
}

function maybeDropPowerup(x, y) {
  // Not every chicken drops a power-up, otherwise the game becomes too easy.
  const dropChance = game.level === 1 ? 0.28 : 0.34;

  if (Math.random() > dropChance) return;

  game.powerups.push({
    x,
    y,
    width: 42,
    height: 42,
    speed: 150,
  });
}

function getDifficultySettings() {
  // Difficulty changes enemy speed, egg speed, egg frequency and available time.
  if (game.difficulty === "easy") {
    return { enemySpeed: 0.75, eggSpeed: 0.8, eggTimer: 1.7, timeBonus: 30 };
  }

  if (game.difficulty === "hard") {
    return { enemySpeed: 1.55, eggSpeed: 1.4, eggTimer: 0.48, timeBonus: -20 };
  }

  return { enemySpeed: 1, eggSpeed: 1, eggTimer: 1, timeBonus: 0 };
}

function createEnemyWave() {
  game.enemies = [];
  const settings = getDifficultySettings();

  const columns = game.level === 1 ? 6 : 7;
  const rows = game.level === 1 ? 1 : 2;
  const gapX = 110;
  const gapY = 76;
  const startX = canvas.width / 2 - ((columns - 1) * gapX) / 2;
  const startY = game.level === 1 ? 96 : 74;

  // Enemies are stored as objects so movement and collision can update them later.
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      game.enemies.push({
        x: startX + column * gapX,
        y: startY + row * gapY,
        width: 74,
        height: 60,
        speed: (game.level === 1 ? 80 : 105) * settings.enemySpeed,
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

    // When the wave hits a side, it turns around and moves slightly lower.
    for (const enemy of game.enemies) {
      enemy.y += 18;
    }
  }

  game.enemyShootTimer -= deltaTime;

  if (game.enemyShootTimer <= 0) {
    const settings = getDifficultySettings();
    const shooter = game.enemies[Math.floor(Math.random() * game.enemies.length)];
    game.eggs.push({
      x: shooter.x,
      y: shooter.y + shooter.height / 2,
      width: 24,
      height: 32,
      speed: (game.level === 1 ? 210 : 260) * settings.eggSpeed,
    });
    game.enemyShootTimer = (game.level === 1 ? 1.35 : 0.9) * settings.eggTimer;
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
        : "Choose level 1 or 2 from the menu.";
  ctx.fillText(message, canvas.width / 2, canvas.height / 2 + 26);
  ctx.textAlign = "left";
}

function checkEggPlayerCollisions() {
  if (game.state !== "playing") return;
  if (game.player.invincibleTimer > 0) return;

  for (let eggIndex = game.eggs.length - 1; eggIndex >= 0; eggIndex -= 1) {
    const egg = game.eggs[eggIndex];

    if (!objectsOverlap(egg, game.player)) continue;

    game.eggs.splice(eggIndex, 1);
    game.health -= 1;
    game.player.invincibleTimer = 1.2;
    statusText.textContent = `Player hit. Health left: ${game.health}.`;
    playSound(sounds.damage);
    break;
  }
}

function checkPowerupPlayerCollisions() {
  if (game.state !== "playing") return;

  for (let powerupIndex = game.powerups.length - 1; powerupIndex >= 0; powerupIndex -= 1) {
    const powerup = game.powerups[powerupIndex];

    if (!objectsOverlap(powerup, game.player)) continue;

    game.powerups.splice(powerupIndex, 1);
    game.player.powerTimer = 3;
    statusText.textContent = "Power-up collected. Triple shot active for 3 seconds.";
    playSound(sounds.power);
    break;
  }
}

function resetGame(startLevel = 1) {
  // Reset all temporary objects so a new level starts cleanly.
  const settings = getDifficultySettings();
  game.state = "playing";
  game.score = 0;
  game.health = 3;
  game.level = startLevel;
  game.timeLeft = (startLevel === 1 ? 180 : 150) + settings.timeBonus;
  game.bullets = [];
  game.eggs = [];
  game.powerups = [];
  game.enemyDirection = 1;
  game.enemyShootTimer = 1.5;
  game.player.x = canvas.width / 2;
  game.player.y = canvas.height - 90;
  game.player.shootCooldown = 0;
  game.player.invincibleTimer = 0;
  game.player.powerTimer = 0;
  createEnemyWave();
  sounds.music.currentTime = 0;
  startMusic();
  hideMenu();
}

function startNextLevel() {
  const settings = getDifficultySettings();
  game.level += 1;
  game.timeLeft = 150 + settings.timeBonus;
  game.bullets = [];
  game.eggs = [];
  game.powerups = [];
  game.enemyDirection = 1;
  game.enemyShootTimer = 1;
  game.player.x = canvas.width / 2;
  game.player.y = canvas.height - 90;
  game.player.shootCooldown = 0;
  game.player.invincibleTimer = 0.8;
  game.player.powerTimer = 0;
  createEnemyWave();
  statusText.textContent = "Level 2 started. Faster enemies and more eggs.";
}

function updateGameState(deltaTime) {
  if (game.state !== "playing") return;

  game.timeLeft = Math.max(0, game.timeLeft - deltaTime);

  // Level 1 automatically continues into level 2.
  if (game.enemies.length === 0 && game.level === 1) {
    startNextLevel();
    return;
  }

  if (game.enemies.length === 0 && game.level === 2) {
    game.state = "won";
    sounds.music.pause();
    playSound(sounds.victory);
    showMenu("You Win!", "You completed both levels. You can restart the game.");
    startButton.textContent = "Play Again";
    statusText.textContent = "You completed both levels. You can restart the game.";
  }

  if (game.timeLeft <= 0) {
    game.state = "lost";
    sounds.music.pause();
    showMenu("Game Over", "Time is over. Restart and try to clear the wave faster.");
    startButton.textContent = "Try Again";
    statusText.textContent = "Time is over. Restart and try to clear the wave faster.";
  }

  if (game.health <= 0) {
    game.state = "lost";
    sounds.music.pause();
    showMenu("Game Over", "Health is 0. Restart and dodge the eggs.");
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
  drawPowerups();
  drawPlayer();
  drawStartText();
}

function gameLoop(currentTime) {
  // Delta time keeps movement stable on faster and slower computers.
  const deltaTime = Math.min(0.033, (currentTime - game.lastTime) / 1000 || 0);
  game.lastTime = currentTime;

  updatePlayer(deltaTime);
  updateBullets(deltaTime);
  updateEggs(deltaTime);
  updatePowerups(deltaTime);
  updateEnemies(deltaTime);
  checkBulletEnemyCollisions();
  checkEggPlayerCollisions();
  checkPowerupPlayerCollisions();
  updateGameState(deltaTime);
  render();
  requestAnimationFrame(gameLoop);
}

function hideMenu() {
  menuOverlay.classList.add("is-hidden");
  menuOverlay.setAttribute("aria-hidden", "true");
}

function showMenu(title = "Chicken Invaders", message = "Choose a level, change options, or start playing.") {
  // Reset menu panels so the player always returns to the main menu first.
  menuTitle.textContent = title;
  statusText.textContent = message;
  mainPanel.hidden = false;
  levelPanel.hidden = true;
  optionsPanel.hidden = true;
  continueButton.disabled = game.state !== "paused";
  menuOverlay.setAttribute("aria-hidden", "false");
  menuOverlay.classList.remove("is-hidden");
}

function showLevelSelect() {
  mainPanel.hidden = true;
  optionsPanel.hidden = true;
  levelPanel.hidden = false;
  menuTitle.textContent = "Select Level";
  statusText.textContent = "Level 1 and 2 are open. Locked levels can be added later.";
}

function showOptions() {
  mainPanel.hidden = true;
  levelPanel.hidden = true;
  optionsPanel.hidden = false;
  menuTitle.textContent = "Options";
  statusText.textContent = "Set volume and difficulty before starting a level.";
}

function pauseGame() {
  if (game.state !== "playing") return;

  game.state = "paused";
  sounds.music.pause();
  showMenu("Paused", "Continue the current game or change options.");
}

function continueGame() {
  if (game.state !== "paused") return;

  game.state = "playing";
  hideMenu();
  startMusic();
}

function getCanvasPoint(event) {
  // Convert screen coordinates to the fixed 1280x720 canvas coordinate system.
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

function setPointerTarget(event) {
  if (game.state !== "playing") return;

  const point = getCanvasPoint(event);
  pointer.active = true;
  pointer.x = clamp(point.x, game.player.width / 2, canvas.width - game.player.width / 2);
  pointer.y = clamp(point.y, canvas.height * 0.45, canvas.height - game.player.height / 2);
}

startButton.addEventListener("click", () => {
  showLevelSelect();
});

continueButton.addEventListener("click", continueGame);

optionsButton.addEventListener("click", () => {
  showOptions();
});

backButton.addEventListener("click", () => {
  optionsPanel.hidden = true;
  mainPanel.hidden = false;
  menuTitle.textContent = "Chicken Invaders";
  statusText.textContent = "Choose a level, change options, or start playing.";
});

levelBackButton.addEventListener("click", () => {
  levelPanel.hidden = true;
  mainPanel.hidden = false;
  menuTitle.textContent = "Chicken Invaders";
  statusText.textContent = "Choose a level, change options, or continue a paused game.";
});

for (const levelButton of levelButtons) {
  levelButton.addEventListener("click", () => {
    const selectedLevel = Number(levelButton.dataset.level);
    resetGame(selectedLevel);
    startButton.textContent = "Start Game";
    statusText.textContent = `Level ${selectedLevel} started. Clear the wave before the timer reaches zero.`;
  });
}

exitButton.addEventListener("click", () => {
  sounds.music.pause();
  showMenu("Exit", "In the browser this closes only when the window was opened by the app.");
  window.close();
});

volumeSlider.addEventListener("input", () => {
  setVolume(Number(volumeSlider.value) / 100);
});

difficultySelect.addEventListener("change", () => {
  game.difficulty = difficultySelect.value;
  const descriptions = {
    easy: "Easy: slower chickens and fewer eggs.",
    normal: "Normal: balanced chickens and eggs.",
    hard: "Hard: faster chickens and many more eggs.",
  };

  statusText.textContent = `${descriptions[game.difficulty]} Start a level to apply it.`;
});

window.addEventListener("keydown", (event) => {
  pressedKeys.add(event.key.toLowerCase());

  if (event.key === " ") {
    shootBullet();
  }

  if (event.key === "Escape" || event.key.toLowerCase() === "p") {
    if (game.state === "playing") {
      pauseGame();
    } else if (game.state === "paused") {
      continueGame();
    }
  }

  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "p", "P"].includes(event.key)) {
    event.preventDefault();
  }
});

window.addEventListener("keyup", (event) => {
  pressedKeys.delete(event.key.toLowerCase());
});

canvas.addEventListener("pointerdown", (event) => {
  pointer.isDown = true;
  setPointerTarget(event);
  shootBullet();
  canvas.setPointerCapture(event.pointerId);
  event.preventDefault();
});

canvas.addEventListener("pointermove", (event) => {
  if (event.pointerType === "mouse" || pointer.isDown) {
    setPointerTarget(event);
  }
});

canvas.addEventListener("pointerup", (event) => {
  pointer.isDown = false;
  if (event.pointerType !== "mouse") {
    pointer.active = false;
  }
});

canvas.addEventListener("pointercancel", () => {
  pointer.isDown = false;
  pointer.active = false;
});

requestAnimationFrame(gameLoop);
setVolume(Number(volumeSlider.value) / 100);
