const backgroundImg = new Image();
backgroundImg.src = "../IMAGE/buckground.jpg";

const runnerImg = new Image();
runnerImg.src = "../IMAGE/runer.png";

const monsterImg = new Image();
monsterImg.src = "../IMAGE/monster.png";

const coinImg = new Image();
coinImg.src = "../IMAGE/coin.png";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => {
  resizeCanvas();
  updateLanes();
  runner.x = lanes[runner.lane];
});

const NUM_LANES = 3;
let lanes = [];
function updateLanes() {
  lanes = [];
  const laneWidth = 120;
  const center = canvas.width / 2;
  const startX = center - laneWidth;
  for (let i = 0; i < NUM_LANES; i++) {
    lanes.push(startX + i * laneWidth);
  }
}
updateLanes();

let monsters = [];
let coins = [];
let score = 0;
let gameOver = false;
let paused = false;

// קבלת שם המשתמש מההתחברות
const username = localStorage.getItem('runnerUser') || 'Guest';
const password = localStorage.getItem('runnerPassword') || ''; // הנחה שסיסמה נשמרת
const userKey = `${username}_${password}`; // מפתח ייחודי

let runner = { lane: 1, x: lanes[1], y: canvas.height - 150, width: 120, height: 120 };

let monsterSpeed = 20;
let coinSpeed = 16;
let backgroundSpeed = 12;
let lastSpeedUpScore = 0;
let scrollY = 0;

// טעינת ניקוד גבוה מה-localStorage
let highScore = parseInt(localStorage.getItem(`highScore_${userKey}`)) || 0;

function drawRunner() {
  ctx.drawImage(runnerImg, runner.x, runner.y, runner.width, runner.height);
}

function drawMonster(monster) {
  ctx.drawImage(monsterImg, monster.x, monster.y, monster.width, monster.height);
}

function drawCoin(coin) {
  ctx.drawImage(coinImg, coin.x, coin.y, coin.radius * 2, coin.radius * 2);
}

function drawBackground() {
  scrollY += backgroundSpeed;
  if (scrollY >= canvas.height) scrollY = 0;
  ctx.drawImage(backgroundImg, 0, scrollY - canvas.height, canvas.width, canvas.height);
  ctx.drawImage(backgroundImg, 0, scrollY, canvas.width, canvas.height);
}

function spawnMonster() {
  let lane;
  let safe = false;
  let attempts = 0;
  while (!safe && attempts < 10) {
    lane = Math.floor(Math.random() * NUM_LANES);
    safe = true;
    for (let coin of coins) {
      if (coin && coin.lane === lane && Math.abs(coin.y - (-120)) < 120) {
        safe = false;
        break;
      }
    }
    for (let monster of monsters) {
      if (monster && monster.lane === lane && Math.abs(monster.y - (-120)) < 120) {
        safe = false;
        break;
      }
    }
    attempts++;
  }
  if (safe) {
    monsters.push({ lane: lane, x: lanes[lane], y: -120, width: 80, height: 120 });
  }
}

function spawnCoin() {
  let lane;
  let safe = false;
  let attempts = 0;
  while (!safe && attempts < 10) {
    lane = Math.floor(Math.random() * NUM_LANES);
    safe = true;
    for (let monster of monsters) {
      if (monster && monster.lane === lane && Math.abs(monster.y - (-20)) < 120) {
        safe = false;
        break;
      }
    }
    for (let coin of coins) {
      if (coin && coin.lane === lane && Math.abs(coin.y - (-20)) < 120) {
        safe = false;
        break;
      }
    }
    attempts++;
  }
  if (safe) {
    coins.push({ lane: lane, x: lanes[lane] + 10, y: -20, radius: 30 });
  }
}

function update() {
  if (gameOver || paused) return;
  runner.x = lanes[runner.lane];

  if (score - lastSpeedUpScore >= 100) {
    monsterSpeed += 2;
    coinSpeed += 2;
    backgroundSpeed += 1;
    lastSpeedUpScore = score;
  }

  drawBackground();

  for (let i = monsters.length - 1; i >= 0; i--) {
    if (!monsters[i]) continue;
    monsters[i].y += monsterSpeed;
    drawMonster(monsters[i]);
    if (isColliding(runner, monsters[i])) {
      endGame();
    }
    if (monsters[i] && monsters[i].y > canvas.height) {
      monsters.splice(i, 1);
    }
  }

  for (let i = coins.length - 1; i >= 0; i--) {
    if (!coins[i]) continue;
    coins[i].y += coinSpeed;
    drawCoin(coins[i]);
    if (isCoinCollected(runner, coins[i])) {
      score += 10;
      coins.splice(i, 1);
      continue;
    }
    if (coins[i] && coins[i].y > canvas.height) {
      coins.splice(i, 1);
    }
  }

  drawRunner();

  document.getElementById("score").textContent = "נקודות: " + score;
}

function endGame() {
  gameOver = true;
  // עדכון ניקוד גבוה אם הניקוד הנוכחי גבוה יותר
  if (score > highScore) {
    highScore = score;
    localStorage.setItem(`highScore_${userKey}`, highScore);
  }
  document.getElementById("gameOver").classList.remove("hidden");
  document.getElementById("finalScore").textContent = "צברת " + score + " נקודות!";
  document.getElementById("highScore").textContent = "הניקוד הגבוה שלך: " + highScore + " נקודות!";
}

document.addEventListener("keydown", (e) => {
  if (gameOver) return;
  if (e.key === "ArrowLeft" && runner.lane > 0) {
    runner.lane--;
    runner.x = lanes[runner.lane];
  }
  if (e.key === "ArrowRight" && runner.lane < NUM_LANES - 1) {
    runner.lane++;
    runner.x = lanes[runner.lane];
  }
  if (e.code === "Space") {
    paused = !paused;
    if (!paused) {
      document.getElementById("gameOver").classList.add("hidden");
    }
  }
});

function restartGame() {
  runner = { lane: 1, x: lanes[1], y: canvas.height - 150, width: 120, height: 120 };
  monsters = [];
  coins = [];
  score = 0;
  gameOver = false;
  paused = false;
  scrollY = 0;
  monsterSpeed = 20;
  coinSpeed = 16;
  backgroundSpeed = 12;
  lastSpeedUpScore = 0;
  document.getElementById("score").textContent = "נקודות: 0";
  document.getElementById("gameOver").classList.add("hidden");
}

document.getElementById("restartBtn").addEventListener("click", restartGame);

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function isCoinCollected(player, coin) {
  return (
    player.x < coin.x + coin.radius * 2 &&
    player.x + player.width > coin.x &&
    player.y < coin.y + coin.radius * 2 &&
    player.y + player.height > coin.y
  );
}

// לולאת המשחק
runnerImg.onload = function() {
  setInterval(() => {
    update();
  }, 30);

  setInterval(() => {
    if (!gameOver && !paused) spawnMonster();
  }, 900);

  setInterval(() => {
    if (!gameOver && !paused) spawnCoin();
  }, 1500);
};