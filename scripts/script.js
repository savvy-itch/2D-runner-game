import {
  spriteX, 
  spriteY, 
  idleVelocity, 
  jumpSprites, 
  offsetPerFrame,
  obstacles,
  maxObstaclesPerScreen,
  minDistanceBetweenObstacles,
  chanceOfGroupedObstacles
} from './config.js';
import {getRandom} from './helpers.js';

const canvas = document.querySelector('.playfield');
const width = canvas.width = 600;
const height = canvas.height = 400;
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'beige';
ctx.fillRect(0, 0, width, height);
ctx.translate(0, -height * 0.3);
ctx.strokeRect(0, 0, width, height);

let startGame = false; 
let isJumpPressed = false;
let isRunning = false;
let sprite = 0;
let frame = 0;
let velocity = 5;
let loopId;

const imageRun = new Image();
imageRun.src = "../images/Run.png";
document.addEventListener('keyup', (e) => {
  if (e.key === 'Enter' && !startGame) {
    startGame = true;
    isRunning = true;
  }
});

const imageIdle = new Image();
imageIdle.src = "../images/Idle.png";

const imageJump = new Image();
imageJump.src = "../images/Jump.png";
document.addEventListener('keydown', (e) => {
  if ((e.code === 'Space' || e.code === 'ArrowUp') && startGame && !isJumpPressed) {
    sprite = 0;
    isRunning = false;
    isJumpPressed = true;
  }
});

const imageRock = new Image();
imageRock.src = "../images/cave_rock5.png";
imageRock.onload = () => {
  loop();
};

document.addEventListener('keyup', (e) => {
  if (e.code === 'Escape') {
    console.log('abort');
    window.cancelAnimationFrame(loopId);
    isRunning = false;
    isJumpPressed = false;
    startGame = false;
  }
});

// =========== Character ===============

function drawIdle() {
  ctx.drawImage(
    imageIdle, 
    sprite * spriteX, // top-left corner of the slice to cut out (X)
    0, // top-left corner of the slice to cut out (Y)
    spriteX, // the size of the slice to cut out (X)
    spriteY, // the size of the slice to cut out (Y)
    0, // top-left corner of canvas box into which to draw the slice (X)
    height - spriteY, // top-left corner of canvas box into which to draw the slice (Y)
    128, // the size of the image on the canvas (X)
    128 // the size of the image on the canvas (Y)
  );

  slowFramerate(idleVelocity, 4);

  frame++;
}

function drawRun() {
  ctx.drawImage(
    imageRun, 
    sprite * spriteX, // top-left corner of the slice to cut out (X)
    0, // top-left corner of the slice to cut out (Y)
    spriteX, // the size of the slice to cut out (X)
    spriteY, // the size of the slice to cut out (Y)
    0, // top-left corner of canvas box into which to draw the slice (X)
    height - spriteY, // top-left corner of canvas box into which to draw the slice (Y)
    128, // the size of the image on the canvas (X)
    128 // the size of the image on the canvas (Y)
  );

  slowFramerate(velocity, 7);

  frame++;
}

let posY = 0;

function drawJump() {
  // if (sprite === 0) console.log('drawJump');

  // ctx.fillRect(-(width / 2), -(height / 2), width, height);
  ctx.drawImage(
    imageJump,
    sprite * spriteX, // top-left corner of the slice to cut out (X)
    0, // top-left corner of the slice to cut out (Y)
    spriteX, // the size of the slice to cut out (X)
    spriteY, // the size of the slice to cut out (Y)
    0, // top-left corner of canvas box into which to draw the slice (X)
    height - posY - spriteY, // top-left corner of canvas box into which to draw the slice (Y)
    128, // the size of the image on the canvas (X)
    128 // the size of the image on the canvas (Y)
  );
  
  slowFramerate(4, jumpSprites);

  // accending and descending
  if (sprite < Math.ceil(jumpSprites / 2)) {
    posY = sprite * offsetPerFrame;
  } else {
    posY = (jumpSprites - sprite) * offsetPerFrame;
  }

  // console.log(sprite, posY, height - posY);

  frame++;
  
  // end of the jump
  if (sprite === jumpSprites) {
    sprite = 0;
    frame = 0;
    isJumpPressed = false;
    isRunning = true;
  }
}

function slowFramerate(velocity, numOfSprites) {
  if (frame % velocity === 0) {
    if (sprite === numOfSprites) {
      sprite = 0;
      frame = 0;
    } else {
      sprite++;
    }
  }
}

// ============ Obstacles =================

class Obstacle {
  constructor(image, x, y, sizeX, sizeY, vel) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.vel = vel;
  }

  drawRock() {
    ctx.drawImage(
      this.image, 
      0, // top-left corner of the slice to cut out (X)
      0, // top-left corner of the slice to cut out (Y)
      this.sizeX, // the size of the slice to cut out (X)
      this.sizeY, // the size of the slice to cut out (Y)
      this.x, // top-left corner of canvas box into which to draw the slice (X)
      this.y, // top-left corner of canvas box into which to draw the slice (Y)
      this.sizeX, // the size of the image on the canvas (X)
      this.sizeY // the size of the image on the canvas (Y)
    );
  }

  updateRock() {
    this.x -= this.vel;

    // when an obstacle moved off-screen
    if (this.x <= (0 - this.sizeX)) {
      return true;
      // obstacleArray.shift();
      // createObstacles();
    }

    return false;
  
    // this.x -= this.vel;
  }
}

function loop() {
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < obstacleArray.length; i++) {
    obstacleArray[i].drawRock();

    if (isRunning || isJumpPressed) {
      if (obstacleArray[i].updateRock()) {
        obstacleArray.splice(i, 1);
        i--;
      }
    }
  }

  if (isRunning) {
    drawRun();
  } else if (isJumpPressed) {
    drawJump();
  } else {
    drawIdle();
  }

  loopId = window.requestAnimationFrame(loop);
}

let obstacleArray = [];
let obstacleVelocity = 5;

document.addEventListener('DOMContentLoaded', createObstacles);

function createObstacles() {
  obstacleArray = [];
  let obstacleAmount = getRandom(0, maxObstaclesPerScreen);

  for (let i = 0; i < obstacleAmount; i++) {

    const obstacleObj = {};
    const imageRock = new Image();
    const idx = getRandom(0, obstacles.length - 1);
    imageRock.src = obstacles[idx].imgSrc;
    obstacleObj.x = width + getRandom(minDistanceBetweenObstacles, width);
    obstacleObj.y = height - obstacles[idx].sizeY;
    const obstacle = new Obstacle(imageRock, obstacleObj.x, obstacleObj.y, obstacles[idx].sizeX, obstacles[idx].sizeY, obstacleVelocity);
    obstacleArray.push(obstacle);
  }
  console.log(obstacleAmount, obstacleArray);
}


// for (const item of obstacles) {
//   const imageRock = new Image();
//   imageRock.src = item.imgSrc;

//   const obstacle = new Obstacle(imageRock, width + item.sizeX, 0, item.sizeX, item.sizeY, obstacleVelocity);
//   obstacleArray.push(obstacle);
// }

// randomize position of an obstacle with regards to the distance to the next obstacle
// add grouped obstacles probability

// const obstacle = new Obstacle(imageRock, width + 29, 0, 29, 24, 5);
