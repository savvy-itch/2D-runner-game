import {
  spriteX, 
  spriteY, 
  idleVelocity, 
  jumpSprites, 
  offsetPerFrame,
  obstacles,
  maxObstaclesPerScreen,
  canvasWidth,
  canvasHeight,
} from './config.js';
import {createSingleObstacle} from './obstacles.js'

const canvas = document.querySelector('.playfield');
const width = canvas.width = canvasWidth;
const height = canvas.height = canvasHeight;
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

let obstacleArray = Array.from({length: maxObstaclesPerScreen});
let obstacleVelocity = 5;

function loop() {
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < obstacleArray.length; i++) {
    if (obstacleArray[i].isVisible) {
      obstacleArray[i].drawObstacle(ctx);
    }

    // only start moving obstacles once the game has started
    if (startGame) {
      obstacleArray[i].updateObstacle();
      // if a character passed an obstacle
      if (obstacleArray[i].isPassed) {
        // generate new obstacle
        obstacleArray[i] = createSingleObstacle(obstacleArray, obstacleVelocity);
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

document.addEventListener('DOMContentLoaded', () => {
  for (let i = 0; i < maxObstaclesPerScreen; i++) {
    obstacleArray[i] = createSingleObstacle(obstacleArray, obstacleVelocity);
  }
});
