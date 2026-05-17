const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

const startButton = document.querySelector("#startButton");
const statusText = document.querySelector("#statusText");

const game = {
  started: false,
  score: 0,
  health: 3,
  level: 1,
  timeLeft: 180,
  player: {
    x: canvas.width / 2,
    y: canvas.height - 90,
    width: 70,
    height: 52,
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

startButton.addEventListener("click", () => {
  game.started = true;
  statusText.textContent = "Game started. Next step: add movement and shooting.";
  render();
});

render();
