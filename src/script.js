function startGame() {
  ctx.fillStyle = canvasBackgroundColor;
  ctx.fillRect(0, 0, width, height);
  main();
  createFood();
  verifyScore();
  document.addEventListener("keydown", changeDirection);
}

function main() {
  if (didGameEnd()) return;

  setTimeout(function onTick() {
    changingDirection = false;
    clearCanvas();
    if (eatenFood % 7 === 0 && bonusAmount === 0) drawBonus(`slowBonus`);
    if (eatenFood % 9 === 0 && bonusAmount === 1) drawBonus(`fastBonus`);
    if (eatenFood % 17 === 0 && bonusAmount === 0) drawBonus(`morePointsBonus`);
    if (eatenFood % 10 === 0 && bonusAmount === 0) drawBonus(`shortenBonus`);
    if (eatenFood % 15 === 0 && bonusAmount === 0) drawBonus(`enlargeBonus`);
    if (eatenFood % 22 === 0 && bonusAmount === 0) drawBonus(`canOmitWallsBonus`);
    checkIfBonusIsOnWall();

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
    enlargeBonusColorBorder: "darkgrey",
    canOmitWallsBonusColor: "pink",
    canOmitWallsBonusBorderColor: "darkorchid"
  };

  properties = {
    type,
    x: randomTen(0, width - 10),
    y: randomTen(0, height - 10)
  };

  ctx.fillStyle = colors[`${properties.type}Color`];
  ctx.strokeStyle = colors[`${properties.type}BorderColor`];

  ctx.fillRect(properties.x, properties.y, 10, 10);

  bonusAmount = 1;

}

function checkIfBonusIsOnWall() {
  if (!levels[selected]) {
    levels[selected] = selected;
  }
  for (let y = 0; y < selected.length; y++) {
    for (let x = 0; x < selected[y].length; x++) {
      if (properties. x === x && properties.y === y) {
        drawBonus(properties[type]);
      }

      if (foodX === x && foodY === y) {
        createFood();
      }
    }
  }
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
  switch (level) {
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
    eatenFood++;
  } else {
    snake.pop();
  }

  const didEatBonus = snake[0].x === properties.x && snake[0].y === properties.y;
  if (didEatBonus) {
    if (properties.type === "slowBonus") {
      gameSpeed = gameSpeed * 2;
      setTimeout(function () { gameSpeed = 100 }, respawnTime);
      bonusAmount = 0;
    }

    else if (properties.type === "fastBonus") {
      gameSpeed = gameSpeed / 2;
      setTimeout(function () { gameSpeed = 100 }, respawnTime)
      bonusAmount = 2;
    }

    else if (properties.type === "morePointsBonus") {
      score = score + bonusScore * multiplier;
      document.querySelector("#score").innerHTML = ` Current score: ${score}`;
      bonusAmount = 0;
    }

    else if (properties.type === "shortenBonus") {
      snake.pop();
      if (multiplier > 1) {
        for (let i = 0; i < multiplier; i++) {
          snake.pop();
        }
      }
      bonusAmount = 0;
    }

    else if (properties.type === "enlargeBonus") {
      snake.unshift(head);

      if (multiplier > 1) {
        for (let i = 0; i <= multiplier; i++) {
          snake.unshift(head);
        }
      }
      enlargeBonusAmount = 0;
      drawBonus(`morePointsBonus`);
    }

    else if (properties.type === "canOmitWallsBonus") {
      isOmittingWallsPossible = true;
      setTimeout(function() {
        isOmittingWallsPossible = false;
      }, respawnTime);
    }
  }
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
  if (localStorage.highest) {
    highestScoresList.innerHTML = "Highest score: " + localStorage.highest;
  }
  for (let i = 0; i < 5; i++) {
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
        ctx.fillRect(x * 10, y * 10, 10, 10);
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

  if(!isOmittingWallsPossible) {
    for (let i = 4; i < snake.length; i++) {
      const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;

      let didCollideWithMazeWall;
      for (let y = 0; y < levels[selected].length; y++) {
        for (let x = 0; x < levels[selected][y].length; x++) {
          if (levels[selected][y][x] === 1) {
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
}

localStorage.getItem("highest");
startGame();

createMaze(selected);