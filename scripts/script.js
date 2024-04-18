import {
  spriteX, 
  spriteY, 
  idleVelocity, 
  jumpSprites, 
  offsetPerFrame,
  obstacles,
  maxObstaclesPerScreen,
  minDistanceBetweenObstacles,
} from './config.js';
import {getRandom} from './helpers.js';

const canvas = document.querySelector('.playfield');
const width = canvas.width = 700;
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
imageRun.src = "../images/character/Run.png";
document.addEventListener('keyup', (e) => {
  if (e.key === 'Enter' && !startGame) {
    startGame = true;
    isRunning = true;
  }
});

const imageIdle = new Image();
imageIdle.src = "../images/character/Idle.png";

const imageJump = new Image();
imageJump.src = "../images/character/Jump.png";
document.addEventListener('keydown', (e) => {
  if ((e.code === 'Space' || e.code === 'ArrowUp') && startGame && !isJumpPressed) {
    sprite = 0;
    isRunning = false;
    isJumpPressed = true;
  }
});


document.addEventListener('DOMContentLoaded', () => {
  let loadedImgs = 0;
  for (let i = 0; i < obstacles.length; i++) {
    const img = new Image();
    img.src = obstacles[i].imgSrc;
    img.onload = () => {
      loadedImgs++;
      if (loadedImgs === obstacles.length) {
        loop();
      }
    }
  }
});

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
  constructor(isPassed, isVisible, image, x, y, sizeX, sizeY, vel) {
    this.isPassed = isPassed;
    this.isVisible = isVisible;
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

    // if the obstacle reached the right edge of the screen, start drawing it
    if (this.x <= width && !this.isVisible) {
      this.isVisible = true;
    } else if (this.x <= (-this.sizeX)) {
      // when an obstacle moves off-screen
      this.isPassed = true;
      this.isVisible = false;
    }
  }
}

// only draw visible obstacles

function loop() {
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < obstacleArray.length; i++) {
    if (obstacleArray[i].isVisible) {
      obstacleArray[i].drawRock();
    }

    // only start moving obstacles once the game has started
    if (startGame) {
      obstacleArray[i].updateRock();
      // if a character passed an obstacle
      if (obstacleArray[i].isPassed) {
        // generate new obstacle
        obstacleArray[i] = createSingleObstacle();
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

let obstacleArray = Array.from({length: maxObstaclesPerScreen});
let obstacleVelocity = 5;

document.addEventListener('DOMContentLoaded', () => {
  for (let i = 0; i < maxObstaclesPerScreen; i++) {
    obstacleArray[i] = createSingleObstacle();
  }
});


function createSingleObstacle() {
  const obstacleObj = {};
  const obstacleImg = new Image();
  const idx = getRandom(0, obstacles.length - 1);
  obstacleImg.src = obstacles[idx].imgSrc;
  
  // Use the farthest obstacle x as minimum x for the new obstacle
  let farthestObstacle = obstacleArray[0] ? obstacleArray[0].x : width;
  obstacleArray.forEach(item => {
    if (item && (item.x > (farthestObstacle + spriteX + minDistanceBetweenObstacles))) {
      farthestObstacle = item.x + item.sizeX;
    }
  });
  const minX = spriteX + minDistanceBetweenObstacles + (farthestObstacle ? farthestObstacle : width);
  let maxX = (width * 2.5) - minDistanceBetweenObstacles;
  if (minX > maxX) {
    maxX += farthestObstacle;
  }

  const distance = getRandom(minX, maxX);
  obstacleObj.isPassed = false;
  obstacleObj.isVisible = false;
  obstacleObj.x = distance;
  obstacleObj.y = height - obstacles[idx].sizeY;
  const obstacle = new Obstacle(obstacleObj.isPassed, obstacleObj.isVisible, obstacleImg, obstacleObj.x, obstacleObj.y, obstacles[idx].sizeX, obstacles[idx].sizeY, obstacleVelocity);
  return obstacle;
}
