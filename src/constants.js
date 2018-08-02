const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

let gameSpeed;
if (!gameSpeed) gameSpeed = 100;

const canvasBackgroundColor = "white";
const snakeColor = "lightgreen";
const snakeBorderColor = "white";
const foodColor = "red";
const foodBorderColor = "darkred";
let selected;

if (!selected) selected = levels.gridLevel1;

const levelSelection = document.querySelector("#levelSelect");
const levelDropdown = document.querySelector("#levels");
const timeSelection = document.querySelector("#timeSelect");
const timeInput = document.querySelector("#number");
const multiplierSelection = document.querySelector("#multiplierSelect");
const multiplierInput = document.querySelector("#multiplier");
const gameSpeedSelection = document.querySelector("#gameSpeedSelect");
const gameSpeedInput = document.querySelector("#gameSpeed");

const highestScoresList = document.querySelector("#highestscore");

let snake = [
  { x: 150, y: 150 },
  { x: 140, y: 150 },
  { x: 130, y: 150 },
  { x: 120, y: 150 },
  { x: 110, y: 150 }
];

const width = canvas.width;
const height = canvas.height;

let standardScore = 10;
let bonusScore = 30;
let score = 0;
let highestScore;
let changingDirection = false;
let foodX;
let foodY;
let eatenFood = 1;
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

let respawnTime;
let multiplier;

if (!multiplier) multiplier = 1;
if (!respawnTime) respawnTime = 5000;

let scores = [];
let highestFive;

const highestList = document.querySelector("#fiveHighest");

let localScores;

let slowBonus;
let x;
let y;
let type;
let properties = { type, x, y };
let food;
let fastBonus;
let morePointsBonus;
let shortenBonus;
let enlargeBonus;
let canOmitWallsBonus;

let isOmittingWallsPossible = false;

let bonusAmount = 0;

let fastBonusAmount = 0;
let morePointsBonusAmount = 0;

const level = levelDropdown.options[levelDropdown.selectedIndex].value;
