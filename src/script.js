const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

let gameSpeed = 100;
const canvasBackgroundColor = "white";
const snakeColor = "lightgreen";
const snakeBorderColor = "white";
const foodColor = "red";
const foodBorderColor = "darkred";
let selected;

if (!selected) selected = levels.gridLevel1;

const levelSelection = document.querySelector("#levelSelect");
const levelDropdown = document.querySelector("#levels");
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
let eatenFood = 0;
let slowBonusX;
let slowBonusY;
let fastBonusX;
let fastBonusY;
let morePointsBonusX;
let morePointsBonusY;
let shortenBonusX;
let shortenBonusY;
let enlargeBonusX;
let enlargeBonusY;
let dx = 10;
let dy = 0;


startGame();


createMaze(selected);

function startGame() {
  ctx.fillStyle = canvasBackgroundColor;
  ctx.fillRect(0, 0, width, height);

  main();
  createFood();
  createSlowBonus();
  createFastBonus();
  createMorePointsBonus();
  createShortenBonus();
  createEnlargenBonus();
  document.addEventListener("keydown", changeDirection);
}

function main() {
  gameOver.style.display = "none";
  if (didGameEnd()) return;
  setTimeout(function onTick() {
    changingDirection = false;
    clearCanvas();
    if (eatenFood > 2) drawSlowBonus();
    if (eatenFood > 10) drawFastBonus();
    if (eatenFood > 25) drawMorePointsBonus();
    if (eatenFood > 12) drawShortenBonus();
    if (eatenFood > 15) drawEnlargeBonus();
    drawFood();
    advanceSnake();
    drawSnake();
    main();
  }, gameSpeed);
}

function clearCanvas() {
  ctx.fillStyle = canvasBackgroundColor;
  ctx.fillRect(snake[snake.length - 1].x, snake[snake.length - 1].y, 10, 10);
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

function drawMorePointsBonus() {
  ctx.fillStyle = "cornflowerblue";
  ctx.strokeStyle = "darkcyan";
  ctx.fillRect(morePointsBonusX, morePointsBonusY, 10, 10);
  ctx.strokeRect(morePointsBonusX, morePointsBonusY, 10, 10);
}

function drawShortenBonus() {
  ctx.fillStyle = "violet";
  ctx.strokeStyle = "darkmagenta";
  ctx.fillRect(shortenBonusX, shortenBonusY, 10, 10);
  ctx.strokeRect(shortenBonusX, shortenBonusY, 10, 10);
}

function drawEnlargeBonus() {
  ctx.fillStyle = "grey";
  ctx.strokeStyle = "darkgrey";
  ctx.fillRect(enlargeBonusX, enlargeBonusY, 10, 10);
  ctx.strokeRect(enlargeBonusX, enlargeBonusY, 10, 10);
}

function advanceSnake() {
  const head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy
  };
  snake.unshift(head);

  if (head.x > 360) {
    head.x = 0;
  }

  if (head.x < 0) {
    head.x = 360;
  }

  if (head.y < 0) {
    head.y = 360;
  }
  if (head.y > 360) {
    head.y = 0;
  }

  const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
  if (didEatFood) {
    score += 10;
    document.querySelector("#score").innerHTML = ` Current score: ${score}`;
    createFood();
    eatenFood ++;
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

  const didEatMorePointsBonus = snake[0].x === morePointsBonusX && snake[0].y === morePointsBonusY;
  if (didEatMorePointsBonus) {
    createMorePointsBonus();
    score += 50;
    document.querySelector("#score").innerHTML = ` Score: ${score}`;
  };

  const didEatShortenBonus = snake[0].x === shortenBonusX && snake[0].y === shortenBonusY;
  if (didEatShortenBonus) {
    createShortenBonus();
    snake.pop();
  }

  const didEatEnlargenBonus = snake[0].x === enlargeBonusX && snake[0].y === enlargeBonusY;
  if (didEatEnlargenBonus) {
    createEnlargenBonus();
  snake.unshift(head);
  }
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

function createMorePointsBonus() {
  morePointsBonusX = randomTen(0, width - 10);
  morePointsBonusY = randomTen(0, height - 10);

  snake.forEach(function isBonusOnSnake(part) {
    const bonusIsOnSnake = part.x === morePointsBonusX && part.y === morePointsBonusY;
    if (bonusIsOnSnake) drawMorePointsBonus();
  });
}

function createShortenBonus() {
  shortenBonusX = randomTen(0, width - 10);
  shortenBonusY = randomTen(0, height - 10);

  snake.forEach(function isBonusOnSnake(part) {
    const bonusIsOnSnake = part.x === shortenBonusX && part.y === shortenBonusY;
    if (bonusIsOnSnake) drawShortenBonus();
  });
}

function createEnlargenBonus() {
  enlargeBonusX = randomTen(0, width - 10);
  enlargeBonusY = randomTen(0, height - 10);

  snake.forEach(function isBonusOnSnake(part) {
    const bonusIsOnSnake = part.x === enlargeBonusX && part.y === enlargeBonusY;
    if (bonusIsOnSnake) drawEnlargeBonus();
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

function createMaze(selected) {
  for (let y = 0; y < selected.length; y++) {
    for (let x = 0; x < selected[y].length; x++) {
      if (selected[y][x] === 1) {
        ctx.fillStyle = "black";
        ctx.fillRect(x*10, y*10, 10, 10);
      }
    }
  }
}

levelSelection.addEventListener("submit", (event) => {
  event.preventDefault();
  selected = levelDropdown.options[levelDropdown.selectedIndex].value;
  createMaze(levels[selected]);
});

function didGameEnd() {
  if (!levels[selected]) {
    levels[selected] = selected;
  }
  for (let i = 4; i < snake.length; i++) {
    const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;

    let didCollideWithMazeWall;
    for (let y = 0; y < levels[selected].length; y++) {
      for (let x = 0; x < levels[selected][y].length; x++) {
        if (levels[selected][y][x] === 1) {
          ctx.fillStyle = "black";
          ctx.fillRect(x*10, y*10, 10, 10);

          // Check collision with maze wall
          if (x * 10 === snake[0].x && y * 10 === snake[0].y) {
            didCollideWithMazeWall = true;
          }
        }
      }
    }

    if (didCollide || didCollideWithMazeWall) {
      gameOver.style.display = "block";
      gameOver.addEventListener("click", startGame());
      return true;
    };
  }
}
