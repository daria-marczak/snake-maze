const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

let gameSpeed = 100;
const canvasBackgroundColor = "white";
const snakeColor = "lightgreen";
const snakeBorderColor = "darkgreen";
const foodColor = "red";
const foodBorderColor = "darkred";

const gameOver = document.querySelector("#over");

let snake = [
  { x: 150, y: 150 },
  { x: 140, y: 150 },
  { x: 130, y: 150 },
  { x: 120, y: 150 },
  { x: 110, y: 150 }
];

const width = canvas.width;
const height = canvas.height;

let score = 0;
let changingDirection = false;
let foodX;
let foodY;
let slowBonusX;
let slowBonusY;
let fastBonusX;
let fastBonusY;
let dx = 10;
let dy = 0;


startGame();

function startGame() {
  main();
  createFood();
  createSlowBonus();
  createFastBonus();
  document.addEventListener("keydown", changeDirection);
}

function main() {
  gameOver.style.display = "none";
  if (didGameEnd()) return;

  setTimeout(function onTick() {
    changingDirection = false;
    clearCanvas();
    drawSlowBonus();
    drawFastBonus();
    drawFood();
    advanceSnake();
    drawSnake();
    main();
  }, gameSpeed);
}

function clearCanvas() {
  ctx.fillStyle = canvasBackgroundColor;
  ctx.fillRect(0, 0, width, height);
}

function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.strokeStyle = foodBorderColor;
  ctx.fillRect(foodX, foodY, 10, 10);
  ctx.strokeRect(foodX, foodY, 10, 10);
}

function drawSlowBonus() {
  ctx.fillStyle = "yellow";
  ctx.strokeStyle = "darkorange";
  ctx.fillRect(slowBonusX, slowBonusY, 10, 10);
  ctx.strokeRect(slowBonusX, slowBonusY, 10, 10);
}

function drawFastBonus() {
  ctx.fillStyle = "green";
  ctx.strokeStyle = "darkgreen";
  ctx.fillRect(fastBonusX, fastBonusY, 10, 10);
  ctx.strokeRect(fastBonusX, fastBonusY, 10, 10);
}

// function drawBonus(type) {
//   switch (type) {
//     case slowBonus:
//       ctx.fillStyle = "yellow";
//       ctx.strokeStyle = "darkyellow";
//       ctx.fillRect(slowBonusX, slowBonusY, 10, 10);
//       ctx.strokeRect(slowBonusX, slowBonusY, 10, 10);
//       break;
//   }
// }

function advanceSnake() {
  const head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy
  };

  snake.unshift(head);

  if (head.x > 500) {
    head.x = 0;
  }

  if (head.x < 0) {
    head.x = 500;
  }

  if (head.y < 0) {
    head.y = 500;
  }
  if (head.y > 500) {
    head.y = 0;
  }

  const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
  if (didEatFood) {
    score += 10;
    document.querySelector("#score").innerHTML = ` Score: ${score}`;
    createFood();
  } else {
    snake.pop();
  }

  const didEatSlowBonus = snake[0].x === slowBonusX && snake[0].y === slowBonusY;
  if (didEatSlowBonus) {
    createSlowBonus();
    gameSpeed = gameSpeed * 2;
    setTimeout(function() {gameSpeed = 100}, 5000);
  };

  const didEatFastBonus = snake[0].x === fastBonusX && snake[0].y === fastBonusY;
  if (didEatFastBonus) {
    createFastBonus();
    gameSpeed = gameSpeed / 2;
    setTimeout(function() {gameSpeed = 100}, 5000);
  };
}

function randomTen(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {
  foodX = randomTen(0, width - 10);
  foodY = randomTen(0, height - 10);

  snake.forEach(function isFoodOnSnake(part) {
    const foodIsOnSnake = part.x === foodX && part.y === foodY;
    if (foodIsOnSnake) drawFood();
  });
}

function createSlowBonus() {
  slowBonusX = randomTen(0, width - 10);
  slowBonusY = randomTen(0, height - 10);

  snake.forEach(function isBonusOnSnake(part) {
    const bonusIsOnSnake = part.x === slowBonusX && part.y === slowBonusY;
    if (bonusIsOnSnake) drawSlowBonus();
  });
}

function createFastBonus() {
  fastBonusX = randomTen(0, width - 10);
  fastBonusY = randomTen(0, height - 10);

  snake.forEach(function isBonusOnSnake(part) {
    const bonusIsOnSnake = part.x === fastBonusX && part.y === fastBonusY;
    if (bonusIsOnSnake) drawFastBonus();
  });
}

function drawSnake() {
  snake.forEach(drawSnakePart);
}

function drawSnakePart(snakePart) {
  ctx.fillStyle = snakeColor;
  ctx.strokeStyle = snakeBorderColor;

  ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function changeDirection(event) {
  const leftKey = 37;
  const rightKey = 39;
  const upKey = 38;
  const downKey = 40;

  if (changingDirection) return;
  changingDirection = true;

  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if (keyPressed === leftKey && !goingRight) {
    dx = -10;
    dy = 0;
  }

  if (keyPressed === upKey && !goingDown) {
    dx = 0;
    dy = -10;
  }

  if (keyPressed === rightKey && !goingLeft) {
    dx = 10;
    dy = 0;
  }

  if (keyPressed === downKey && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

function didGameEnd() {
  for (let i = 4; i < snake.length; i++) {
    const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y
    
    if (didCollide) {
      gameOver.style.display = "block";
      gameOver.addEventListener("click", startGame());
      return true;
    };
  }
}
