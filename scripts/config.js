export const audioVolume = .3;
const smallScreenWidth = window.innerWidth > 1024 ? 700 : window.innerWidth * .95;
const smallScreenHeight = window.innerWidth > 1024 ? 400 : window.innerHeight * .4;
export const canvasWidth = window.innerWidth > 1600 ? 900 : smallScreenWidth;
export const canvasHeight = window.innerWidth > 1600 ? 500 : smallScreenHeight;
export const smallScreenCoefficient = window.innerWidth > 1024 ? 1 : .75;
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
export const offsetPerFrame = window.innerWidth > 1024 ? 60 : 40;
export const runSprites = 7;
export const spriteX = 128;
export const spriteY = 128;
export const spriteXNoPadding = 54;
export const spriteYNoPadding = 75;
export const spriteXScaled = window.innerWidth > 1024 ? spriteXNoPadding : Math.round(spriteXNoPadding * smallScreenCoefficient);
export const spriteYScaled = window.innerWidth > 1024 ? spriteYNoPadding : Math.round(spriteYNoPadding * smallScreenCoefficient);
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
    skyBg: {
      lg: "images/env/sky.webp",
      sm: "images/env/sky_500x281.webp"
    },
    groundBg: "images/env/ground.webp",
    skyBgObj: "images/env/clouds.webp",
    groundBgObj: "images/env/foreground.webp"
  },
  {
    level: 2,
    skyBg: {
      lg: "images/env/dusk_sky.webp",
      sm: "images/env/dusk_sky_500x281.webp"
    },
    groundBg: "images/env/dusk_ground.webp",
  },
  {
    level: 3,
    skyBg: {
      lg: "images/env/night_sky.webp",
      sm: "images/env/night_sky_500x281.webp"
    },
    groundBg: "images/env/night_ground.webp",
  },
];
export const controlsTipHtml = {
  touchScreen: `
    <p>Tap to jump</p>
    <div class="control-keys">
      <img src="./images/touch-icon.png" alt="touch">
    </div>
  `,
  keyboard: `
    <p>Jump</p>
    <div class="control-keys">
      <img src="./images/arrow-up2.png" alt="arrow up">
      <p>or</p>
      <img src="./images/spacebar2.png" alt="spacebar">
    </div>
  `
}
export const audioUrls = [
  ['death', 'audio/fr_death-1.mp3'],
  ['newLevel', 'audio/fr_new level-1.mp3'],
  ['newRecord', 'audio/fr_new record-1.mp3'],
  ['jump', 'audio/fr_jump.mp3'],
  ['click', 'audio/fr_click.mp3'],
]
