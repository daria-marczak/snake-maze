let slowBonus;
let properties;
let food;
let fastBonus;
let morePointsBonus;
let shortenBonus;
let enlargeBonus;


let bonusAmount = 0;

function startGame() {
  ctx.fillStyle = canvasBackgroundColor;
  ctx.fillRect(0, 0, width, height);
  main();
  createFood();
  // createBonus();
  // createFastBonus();
  // createMorePointsBonus();
  verifyScore();

  // createShortenBonus();
  // createEnlargenBonus();
  document.addEventListener("keydown", changeDirection);
}

function main() {
  if (didGameEnd()) return;
  setTimeout(function onTick() {
    changingDirection = false;
    clearCanvas();
    if (eatenFood > 2 && bonusAmount === 0) drawBonus(`slowBonus`);
    if (eatenFood > 10) drawBonus(`fastBonus`);
    if (eatenFood > 25) drawBonus(`morePointsBonus`);
    if (eatenFood > 12) drawBonus(`shortenBonus`);
    if (eatenFood > 15) drawBonus(`enlargeBonus`);
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

function drawBonus(type) {
  const colors = {
    slowBonusColor: "yellow",
    slowBonusBorderColor: "darkorange",
    fastBonusColor: "green",
    fastBonusBorderColor: "darkgreen",
    morePointsBonusColor: "cornflowerblue",
    morePointsBonusBorderColor: "darkcyan",
    shortenBonusColor: "violet",
    shortenBonusColorBorder: "darkmagenta",
    enlargeBonusColor: "grey",
    enlargeBonusColorBorder: "darkgrey"
  };

  properties = {
    type,
    x: randomTen(0, width - 10),
    y: randomTen(0, height - 10)
  };

  console.log(properties.type, properties.x, properties.y)

  ctx.fillStyle = colors[`${properties.type}Color`];
  ctx.strokeStyle = colors[`${properties.type}BorderColor`];

  ctx.fillRect(properties.x, properties.y, 10, 10);
  bonusAmount = bonusAmount + 1
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
  const level = levelDropdown.options[levelDropdown.selectedIndex].value;
  switch(level) {
    case "gridLevel1":
      standardScore;
      break;
    case "gridLevel2":
      standardScore = 20;
      break;
    case "gridLevel3":
      standardScore = 30;
      break;
    case "gridLevel4":
      standardScore = 40;
      break;
    case "gridLevel5":
      standardScore = 50;
      break;
    default:
      standardScore;
  }
  const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
  if (didEatFood) {
    score += standardScore;
    document.querySelector("#score").innerHTML = ` Current score: ${score}`;
    createFood();
    eatenFood ++;
  } else {
    snake.pop();
  }

  // const didEatSlowBonus = snake[0].x === slowBonusX && snake[0].y === slowBonusY;
  // if (didEatSlowBonus) {
  //   createSlowBonus();
  //   gameSpeed = gameSpeed * 2;
  //   setTimeout(function() {gameSpeed = 100}, respawnTime);
  // };

  // const didEatFastBonus = snake[0].x === fastBonusX && snake[0].y === fastBonusY;
  // if (didEatFastBonus) {
  //   createFastBonus();
  //   gameSpeed = gameSpeed / 2;
  //   setTimeout(function() {gameSpeed = 100}, respawnTime)
  // };

  // const didEatMorePointsBonus = snake[0].x === morePointsBonusX && snake[0].y === morePointsBonusY;
  // if (didEatMorePointsBonus) {
  //   createMorePointsBonus();
  //   score * multiplier;
  //   document.querySelector("#score").innerHTML = ` Score: ${score}`;
  // };

  // const didEatShortenBonus = snake[0].x === shortenBonusX && snake[0].y === shortenBonusY;
  // if (didEatShortenBonus) {
  //   createShortenBonus();
  //   if (multiplier > 1) {
  //     for (let i = 0; i <= multiplier; i++) {
  //       snake.pop();
  //     }
  //   }
  // }

  // const didEatEnlargenBonus = snake[0].x === enlargeBonusX && snake[0].y === enlargeBonusY;
  // if (didEatEnlargenBonus) {
  //   createEnlargenBonus();
  //   if (multiplier > 1) {
  //     for (let i = 0; i <= multiplier; i++) {
  //       snake.unshift(head);
  //     }
  //   }
  // }
}

function verifyScore() {
  if (!localStorage == null) localStorage.getItem("highest", highestScore);
  if (score > localStorage.highest) {
    scores.push(score);
    localStorage.setItem("highest", score);
  }

  highestFive = scores.sort((a, b) => b - a).slice(0, 5).toString(", ");
  localStorage.setItem("highestFive", highestFive);
  localScores = localStorage.getItem("highestFive").split(",");
  highestScoresList.innerHTML = "Highest score: " + localStorage.highest;
  for (let i = 0; i < 5 ; i++) {
    highestList.innerHTML = `<li class="score__item"> ${"undefined" == typeof localScores[i] ? "" : localScores[i]}</li>`
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

// function createSlowBonus() {
//   slowBonusX = randomTen(0, width - 10);
//   slowBonusY = randomTen(0, height - 10);

//   snake.forEach(function isBonusOnSnake(part) {
//     const bonusIsOnSnake = part.x === slowBonusX && part.y === slowBonusY;
//     if (bonusIsOnSnake) drawSlowBonus();
//   });
// }

// function createFastBonus() {
//   fastBonusX = randomTen(0, width - 10);
//   fastBonusY = randomTen(0, height - 10);

//   snake.forEach(function isBonusOnSnake(part) {
//     const bonusIsOnSnake = part.x === fastBonusX && part.y === fastBonusY;
//     if (bonusIsOnSnake) drawFastBonus();
//   });
// }

// function createMorePointsBonus() {
//   morePointsBonusX = randomTen(0, width - 10);
//   morePointsBonusY = randomTen(0, height - 10);

//   snake.forEach(function isBonusOnSnake(part) {
//     const bonusIsOnSnake = part.x === morePointsBonusX && part.y === morePointsBonusY;
//     if (bonusIsOnSnake) drawMorePointsBonus();
//   });
// }

// function createShortenBonus() {
//   shortenBonusX = randomTen(0, width - 10);
//   shortenBonusY = randomTen(0, height - 10);

//   snake.forEach(function isBonusOnSnake(part) {
//     const bonusIsOnSnake = part.x === shortenBonusX && part.y === shortenBonusY;
//     if (bonusIsOnSnake) drawShortenBonus();
//   });
// }

// function createEnlargenBonus() {
//   enlargeBonusX = randomTen(0, width - 10);
//   enlargeBonusY = randomTen(0, height - 10);

//   snake.forEach(function isBonusOnSnake(part) {
//     const bonusIsOnSnake = part.x === enlargeBonusX && part.y === enlargeBonusY;

//     if (bonusIsOnSnake) drawEnlargeBonus();
//   });
// }

function createBonus(type) {
  console.log(type);
  // console.log(properties.x, properties.y)
  snake.forEach(function isBonusOnSnake(part) {
    const bonusIsOnSnake = part.x === shortenBonusX && part.y === shortenBonusY;
    if (bonusIsOnSnake) drawShortenBonus();
  });
}

createBonus(`slowBonus`)

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

timeSelection.addEventListener("submit", event => {
  event.preventDefault();
  respawnTime = timeInput.value;
});

multiplierSelection.addEventListener("submit", event => {
  event.preventDefault();
  multiplier = multiplierInput.value;
});

gameSpeedSelection.addEventListener("submit", event => {
  event.preventDefault();
  gameSpeed = gameSpeedInput.value;
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
          // Check collision with maze wall
          if (x * 10 === snake[0].x && y * 10 === snake[0].y) {
            didCollideWithMazeWall = true;
          }
        }
      }
    }

    if (didCollide || didCollideWithMazeWall) {
      verifyScore();
      return true;
    };
  }
}

localStorage.getItem("highest");
startGame();

createMaze(selected);