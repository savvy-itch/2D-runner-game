export const canvasWidth = 700;
export const canvasHeight = 400;
export const spriteX = 128;
export const spriteY = 128;
export const spriteXNoPadding = 54;
export const spriteYNoPadding = 75;
export const spriteDeadXNoPadding = 76;
export const spriteXPadding = (spriteX - spriteXNoPadding) / 2;
export const spriteDeadXPadding = (spriteX - spriteDeadXNoPadding) / 2;
export const idleVelocity = 13;
export const deadVel = 10;
export const runSprites = 7;
export const jumpSprites = 7;
export const deadSprites = 4;
// export const offsetPerFrame = spriteY / Math.ceil(jumpSprites / 2);
export const offsetPerFrame = 60;
export const maxObstaclesPerScreen = 3;
export const minDistanceBetweenObstacles = 50;
export const chanceOfGroupedObstacles = 10;
export const noObstaclesChance = .3; // 0 - 0.9
export const scoreCharsAmount = 5;
export const initScoreVel = 20;
export const maxLevel = 5;
export const obstacles = [
  {
    imgSrc: "../images/obstacles/cave_rock4.png",
    sizeX: 63,
    sizeY: 44,
  },
  {
    imgSrc: "../images/obstacles/cave_rock5.png",
    sizeX: 29,
    sizeY: 24,
  },
  {
    imgSrc: "../images/obstacles/Bush4_4.png",
    sizeX: 48,
    sizeY: 40,
  },
  {
    imgSrc: "../images/obstacles/Bush5_4.png",
    sizeX: 59,
    sizeY: 23,
  },
  {
    imgSrc: "../images/obstacles/Bush6_3.png",
    sizeX: 59,
    sizeY: 42,
  },
  {
    imgSrc: "../images/obstacles/Bush6_4.png",
    sizeX: 46,
    sizeY: 30,
  },
  {
    imgSrc: "../images/obstacles/Bush7_4.png",
    sizeX: 47,
    sizeY: 21,
  },
  {
    imgSrc: "../images/obstacles/Bush8_4.png",
    sizeX: 43,
    sizeY: 21,
  },
  {
    imgSrc: "../images/obstacles/canyon_rock3.png",
    sizeX: 46,
    sizeY: 66,
  },
  {
    imgSrc: "../images/obstacles/canyon_rock4.png",
    sizeX: 35,
    sizeY: 50,
  },
  {
    imgSrc: "../images/obstacles/desert_rock4.png",
    sizeX: 58,
    sizeY: 18,
  },
  {
    imgSrc: "../images/obstacles/fir_tree_6.png",
    sizeX: 36,
    sizeY: 55,
  },
  {
    imgSrc: "../images/obstacles/fir_tree_11.png",
    sizeX: 23,
    sizeY: 34,
  },
  {
    imgSrc: "../images/obstacles/jungle_tree_13.png",
    sizeX: 20,
    sizeY: 29,
  },
  {
    imgSrc: "../images/obstacles/middle_lane_rock1_4.png",
    sizeX: 61,
    sizeY: 40,
  },
  {
    imgSrc: "../images/obstacles/middle_lane_rock1_5.png",
    sizeX: 41,
    sizeY: 26,
  },
  {
    imgSrc: "../images/obstacles/middle_lane_tree9.png",
    sizeX: 26,
    sizeY: 34,
  },
  {
    imgSrc: "../images/obstacles/middle_lane_tree10.png",
    sizeX: 27,
    sizeY: 70,
  },
]