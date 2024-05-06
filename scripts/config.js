const smallScreen = window.innerWidth > 1024 ? 700 : window.innerWidth * .95;
export const canvasWidth = window.innerWidth > 1600 ? 900 : smallScreen;
export const canvasHeight = window.innerWidth > 1600 ? 500 : 400;
export const deadSprites = 4;
export const deadVel = 10;
export const idleVelocity = 13;
export const initialBackgroundVel = 1;
export const initialForegroundVel = 2;
export const initScoreVel = 20;
export const jumpSprites = 7;
export const maxLevel = 5;
export const maxObstaclesPerScreen = 3;
export const scoreCharsAmount = 5;
export const maxScore = Number(String('').padStart(scoreCharsAmount, '9'));
export const minDistanceBetweenObstacles = 50;
export const nextEnvScorePoint = 400;
export const offsetPerFrame = 60;
export const runSprites = 7;
export const spriteX = 128;
export const spriteY = 128;
export const spriteXNoPadding = 54;
export const spriteYNoPadding = 75;
export const spriteDeadXNoPadding = 76;
export const spriteXPadding = (spriteX - spriteXNoPadding) / 2;
export const spriteDeadXPadding = (spriteX - spriteDeadXNoPadding) / 2;
export const obstacles = [
  {
    imgSrc: "images/obstacles/cave_rock4.png",
    sizeX: 63,
    sizeY: 44,
  },
  {
    imgSrc: "images/obstacles/cave_rock5.png",
    sizeX: 29,
    sizeY: 24,
  },
  {
    imgSrc: "images/obstacles/Bush4_4.png",
    sizeX: 48,
    sizeY: 40,
  },
  {
    imgSrc: "images/obstacles/Bush5_4.png",
    sizeX: 59,
    sizeY: 23,
  },
  {
    imgSrc: "images/obstacles/Bush6_3.png",
    sizeX: 59,
    sizeY: 42,
  },
  {
    imgSrc: "images/obstacles/Bush6_4.png",
    sizeX: 46,
    sizeY: 30,
  },
  {
    imgSrc: "images/obstacles/Bush7_4.png",
    sizeX: 47,
    sizeY: 21,
  },
  {
    imgSrc: "images/obstacles/Bush8_4.png",
    sizeX: 43,
    sizeY: 21,
  },
  {
    imgSrc: "images/obstacles/canyon_rock3.png",
    sizeX: 46,
    sizeY: 66,
  },
  {
    imgSrc: "images/obstacles/canyon_rock4.png",
    sizeX: 35,
    sizeY: 50,
  },
  {
    imgSrc: "images/obstacles/desert_rock4.png",
    sizeX: 58,
    sizeY: 18,
  },
  {
    imgSrc: "images/obstacles/fir_tree_6.png",
    sizeX: 36,
    sizeY: 55,
  },
  {
    imgSrc: "images/obstacles/fir_tree_11.png",
    sizeX: 23,
    sizeY: 34,
  },
  {
    imgSrc: "images/obstacles/jungle_tree_13.png",
    sizeX: 20,
    sizeY: 29,
  },
  {
    imgSrc: "images/obstacles/middle_lane_rock1_4.png",
    sizeX: 61,
    sizeY: 40,
  },
  {
    imgSrc: "images/obstacles/middle_lane_rock1_5.png",
    sizeX: 41,
    sizeY: 26,
  },
  {
    imgSrc: "images/obstacles/middle_lane_tree9.png",
    sizeX: 26,
    sizeY: 34,
  },
  {
    imgSrc: "images/obstacles/middle_lane_tree10.png",
    sizeX: 27,
    sizeY: 70,
  },
];
export const menuHtml = {
  gameBeaten: `
    <p class="dialog-heading">Congratulations!</p>
    <p>You beat the game!</p>
    <p>Now go outside and touch grass)</p>
    <button id="restart-btn" class="restart-btn">
      <img src="./images/restart-2.svg" alt="restart">
    </button>
  `,
  gameOver: `
    <p class="dialog-heading">Game Over</p>
    <div class="dialog-results-container">
      <div class="best-record-wrapper">
        <p>Best score:</p>
        <p id="dialog-best-record" class="menu-best">0000</p>
      </div>
      <div>
        <p>Your score:</p>
        <p id="dialog-score">00000</p>
      </div>
    </div>
    <button id="restart-btn" class="restart-btn">
      <img src="./images/restart-2.svg" alt="restart">
    </button>
  `,
}
export const levelsEnv = [
  {
    level: 1,
    skyBg: "images/env/1/1.png",
    groundBg: "images/env/1/ground.png",
    skyBgObj: "images/env/1/4.png",
    groundBgObj: "images/env/1/3.png"
  },
  {
    level: 2,
    skyBg: "images/env/1/dusk_sky.png",
    groundBg: "images/env/1/dusk_ground.png",
  },
  {
    level: 3,
    skyBg: "images/env/1/night_sky.png",
    groundBg: "images/env/1/night_ground.png",
  },
];
