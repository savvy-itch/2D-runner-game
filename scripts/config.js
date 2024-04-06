export const spriteX = 128;
export const spriteY = 128;
export const idleVelocity = 13;
export const jumpSprites = 7;
export const offsetPerFrame = spriteY / Math.ceil(jumpSprites / 2);
export const maxObstaclesPerScreen = 2;
export const minDistanceBetweenObstacles = 50;
export const chanceOfGroupedObstacles = 10;
export const obstacles = [
  {
    imgSrc: "../images/cave_rock4.png",
    sizeX: 63,
    sizeY: 44,
  },
  {
    imgSrc: "../images/cave_rock5.png",
    sizeX: 29,
    sizeY: 24,
  },
]

// {
//   imgSrc: "../images/cave_rock3.png",
//   sizeX: 89,
//   sizeY: 62
// },