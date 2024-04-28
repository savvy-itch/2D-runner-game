import { Background } from './background.js';
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
  scoreCharsAmount,
  initScoreVel,
  maxLevel,
  spriteXPadding,
  spriteXNoPadding,
  spriteYNoPadding,
  deadSprites,
  runSprites,
  spriteDeadXPadding,
  spriteDeadXNoPadding,
  initialBackgroundVel,
  initialForegroundVel
} from './config.js';
import { displayScore } from './helpers.js';
import { populateMenu } from './menu.js';
import {createSingleObstacle} from './obstacles.js'

const canvas = document.querySelector('.playfield');
const scoreSpan = document.getElementById('score');
const bestScoreSpan = document.getElementById('best');
const dialogWindow = document.getElementById('dialog');
const startBtn = document.getElementById('start-btn');
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
let isIdle = false;
let isDead = false;
let sprite = 0;
let frame = 0;
let velocity = 5;
let loopId;
let deadAnimationplayed = false;
let score = 0;
let bestScore = 0;
let isNewBest = false;
let isRestart = false;

const skyImg = new Image();
skyImg.src = "../images/env/1/1.png";
const skyObjectsImg = new Image();
skyObjectsImg.src = "../images/env/1/4.png";
const groundImg = new Image();
groundImg.src = "../images/env/1/2.png";
const groundObjectsImg = new Image();
groundObjectsImg.src = "../images/env/1/3.png";

const imageRun = new Image();
imageRun.src = "../images/character/Run.png";
document.addEventListener('keyup', (e) => {
  if (e.key === 'Enter' && !startGame && !isRestart) {
    startGameFn();
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

startBtn.addEventListener('click', () => {
  startGameFn();
})

function startGameFn() {
  startBtn.classList.remove('show-start-btn');
  startGame = true;
  isRunning = true;
  isIdle = false;
  isDead = false;
  score = 0;
  isNewBest = false;
  displayScore(scoreSpan, score);
  updateBestResult();
}

function restartGame() {
  for (let i = 0; i < bgArray.length; i++) {
    bgArray[i].backgroundX = i * width;
    bgArray[i].foregroundX = i * width;
  }
  backgroundVel = initialBackgroundVel;
  foregroundVel = initialForegroundVel;
  obstacleArray = Array.from({length: maxObstaclesPerScreen});
  obstacleVelocity = 6;
  scoreFreq = 0;
  scoreVel = 20;
  level = 1;
  sprite = 0;
  frame = 0;
  
  for (let i = 0; i < maxObstaclesPerScreen; i++) {
    obstacleArray[i] = createSingleObstacle(obstacleArray, obstacleVelocity);
  }

  hideDialog();
  startGame = true;
  isRunning = true;
  isIdle = false;
  isDead = false;
  score = 0;
  isNewBest = false;
  deadAnimationplayed = false;
  displayScore(scoreSpan, score);
  updateBestResult();
  loop();
}

const imageDead = new Image();
imageDead.src = "../images/character/Dead.png";

document.addEventListener('DOMContentLoaded', () => {
  let loadedImgs = 0;
  for (let i = 0; i < obstacles.length; i++) {
    const img = new Image();
    img.src = obstacles[i].imgSrc;
    img.onload = () => {
      loadedImgs++;
      if (loadedImgs === obstacles.length) {
        isIdle = true;
        loop();
      }
    }
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'Escape') {
    console.log('abort');
    endGame('gameOver');
  }
});

function endGame(type) {
  startGame = false;
  window.cancelAnimationFrame(loopId);
  isRunning = false;
  isJumpPressed = false;
  isIdle = false;
  updateBestResult();
  setTimeout(() => {
    populateMenu(type, bestScore, score, isNewBest);
    displayDialog();
    isRestart = true;
    const restartBtn = document.getElementById('restart-btn');
    restartBtn.addEventListener('click', () => {
      restartGame();
    });
    document.addEventListener('keyup', (e) => {
      if ((e.code === 'Space' || e.key === 'Enter') && !startGame) {
        restartGame();
      }
    });
  }, 300);
}

function displayDialog() {
  dialogWindow.classList.add('show-dialog');
}

function hideDialog() {
  dialogWindow.classList.remove('show-dialog');
}

// =========== Character ===============

class Hero {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  drawIdle() {
    ctx.drawImage(
      imageIdle, 
      (sprite * spriteX) + spriteXPadding, // top-left corner of the slice to cut out (X)
      0, // top-left corner of the slice to cut out (Y)
      spriteXNoPadding, // the size of the slice to cut out (X)
      spriteYNoPadding, // the size of the slice to cut out (Y)
      this.x, // top-left corner of canvas box into which to draw the slice (X)
      this.y, // top-left corner of canvas box into which to draw the slice (Y)
      spriteXNoPadding, // the size of the image on the canvas (X)
      spriteYNoPadding // the size of the image on the canvas (Y)
    );
    // ctx.strokeRect(this.x, this.y, spriteXNoPadding, spriteYNoPadding);

  slowFramerate(idleVelocity, 4);

  frame++;
  }

  drawRun() {
    ctx.drawImage(
      imageRun,
      (sprite * spriteX) + spriteXPadding, // top-left corner of the slice to cut out (X)
      spriteY - spriteYNoPadding, // top-left corner of the slice to cut out (Y)
      spriteXNoPadding, // the size of the slice to cut out (X)
      spriteYNoPadding, // the size of the slice to cut out (Y)
      this.x, // top-left corner of canvas box into which to draw the slice (X)
      this.y, // top-left corner of canvas box into which to draw the slice (Y)
      spriteXNoPadding, // the size of the image on the canvas (X)
      spriteYNoPadding // the size of the image on the canvas (Y)
    );
    // ctx.strokeRect(this.x, this.y, spriteXNoPadding, spriteYNoPadding);
  
    slowFramerate(velocity, runSprites);
  
    frame++;
  }

  drawJump() {
    ctx.drawImage(
      imageJump,
      (sprite * spriteX) + spriteXPadding, // top-left corner of the slice to cut out (X)
      spriteY - spriteYNoPadding, // top-left corner of the slice to cut out (Y)
      spriteXNoPadding, // the size of the slice to cut out (X)
      spriteYNoPadding, // the size of the slice to cut out (Y)
      this.x, // top-left corner of canvas box into which to draw the slice (X)
      this.y - posY, // top-left corner of canvas box into which to draw the slice (Y)
      spriteXNoPadding, // the size of the image on the canvas (X)
      spriteYNoPadding // the size of the image on the canvas (Y)
    );
    // ctx.strokeRect(this.x, this.y - posY, spriteXNoPadding, spriteYNoPadding);
    
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

  drawDead() {
    ctx.drawImage(
      imageDead,
      ((sprite > deadSprites ? deadSprites : sprite) * spriteX) + spriteDeadXPadding, // top-left corner of the slice to cut out (X)
      spriteY - spriteYNoPadding, // top-left corner of the slice to cut out (Y)
      spriteDeadXNoPadding, // the size of the slice to cut out (X)
      spriteYNoPadding, // the size of the slice to cut out (Y)
      0, // top-left corner of canvas box into which to draw the slice (X)
      this.y - posY, // top-left corner of canvas box into which to draw the slice (Y)
      spriteDeadXNoPadding, // the size of the image on the canvas (X)
      spriteYNoPadding // the size of the image on the canvas (Y)
    );
    // ctx.strokeRect(0, this.y - posY, spriteDeadXNoPadding, spriteYNoPadding);

    if (sprite >= deadSprites) {
      deadAnimationplayed = true;
    } else {
      slowFramerate(velocity, deadSprites);
      frame++;
    }
  }

  detectCollision(obstacleX, obstacleY) {
    if (obstacleX <= (this.x + spriteXNoPadding) 
      && obstacleX >= this.x
      && obstacleY <= (this.y - posY + spriteYNoPadding)) {
        return true;
    }
    return false;
  }
}

const hero = new Hero(25, height - spriteYNoPadding);

let posY = 0;

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

let obstacleArray = Array.from({length: maxObstaclesPerScreen});
let obstacleVelocity = 6;
let scoreFreq = 0;
let scoreVel = 20;
let level = 1;
const maxScore = Number(String('').padStart(scoreCharsAmount, '9'));

function updateScore() {
  if (score === maxScore) {
    endGame('gameBeaten');
  }
  scoreFreq++;

  if (scoreFreq === scoreVel) {
    score++;
    displayScore(scoreSpan, score);
    scoreFreq = 0;

    if (score > 0 && (score % 100 === 0) && level < maxLevel) {
      level++;
      obstacleVelocity += .9;
      backgroundVel += .5;
      foregroundVel += .5;
      updateBgVel();
      updateObstacleVel();
      scoreVel = initScoreVel * ((100 - (level * 10)) / 100);
    }
  }
}

function updateBestResult() {
  const currentBest = sessionStorage.getItem("best-score");
  if (!currentBest || (score > currentBest)) {
    bestScore = score;
    sessionStorage.removeItem("best-score");
    sessionStorage.setItem("best-score", bestScore);
    displayScore(bestScoreSpan, bestScore);
    isNewBest = true;
  } else {
    bestScore = currentBest;
    displayScore(bestScoreSpan, bestScore);
  }
}

function updateObstacleVel() {
  for (const item of obstacleArray) {
    item.vel = obstacleVelocity;
  }
}

function updateBgVel() {
  for (const item of bgArray) {
    item.backgroundVel = backgroundVel;
    item.foregroundVel = foregroundVel;
  }
}

let backgroundVel = initialBackgroundVel;
let foregroundVel = initialForegroundVel;
const background = new Background(0, 0, backgroundVel, foregroundVel);
const background2 = new Background(width, width, backgroundVel, foregroundVel);
let bgArray = [background, background2];

function loop() {
  ctx.fillRect(0, 0, width, height);

  // all the backgrounds should be drawn first, otherwise the velocity discrepancy
  // will eventually cause background to cover foreground  
  for (let i = 0; i < bgArray.length; i++) {
    bgArray[i].drawBackground(ctx, skyImg);
    bgArray[i].drawBackground(ctx, groundImg);
  }

  for (let i = 0; i < bgArray.length; i++) {
    bgArray[i].drawForeground(ctx, skyObjectsImg);
    bgArray[i].drawForeground(ctx, groundObjectsImg);
    
    if ((bgArray[i].backgroundX + width) <= 0) {
      bgArray[i].backgroundX = width;
    }
    if ((bgArray[i].foregroundX + width) <= 0) {
      bgArray[i].foregroundX = width;
    }

    if (startGame && !isDead) {
      bgArray[i].updateBg();
    }
  }


  for (let i = 0; i < obstacleArray.length; i++) {
    if (obstacleArray[i].isVisible) {
      obstacleArray[i].drawObstacle(ctx);
    }

    // only start moving obstacles when the game is on
    if (startGame && !isDead) {
      obstacleArray[i].updateObstacle(ctx);
      updateScore();
      if (hero.detectCollision(obstacleArray[i].x, obstacleArray[i].y)) {
        isDead = true;
        sprite = 0;
        frame = 0;
      }
      // if a character passed an obstacle
      if (obstacleArray[i].isPassed) {
        // generate new obstacle
        obstacleArray[i] = createSingleObstacle(obstacleArray, obstacleVelocity);
      }
    }
  }

  if (isDead && startGame && !deadAnimationplayed) {
    hero.drawDead();
  } else if (isRunning) {
    hero.drawRun();
  } else if (isJumpPressed) {
    hero.drawJump();
  } else if (isIdle) {
    hero.drawIdle();
  }

  loopId = window.requestAnimationFrame(loop);
  if (deadAnimationplayed) {
    endGame('gameOver');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  for (let i = 0; i < maxObstaclesPerScreen; i++) {
    obstacleArray[i] = createSingleObstacle(obstacleArray, obstacleVelocity);
  }
  displayScore(scoreSpan, score);
  updateBestResult();
});
