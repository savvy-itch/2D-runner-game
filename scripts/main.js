import { createBgElement } from './background.js';
import {
  canvasWidth,
  canvasHeight,
  spriteX,
  spriteY, 
  idleVelocity, 
  jumpSprites, 
  offsetPerFrame,
  maxObstaclesPerScreen,
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
  initialForegroundVel,
  levelsEnv,
  maxScore,
  nextEnvScorePoint,
  spriteXScaled,
  spriteYScaled,
  smallScreenCoefficient,
} from './config.js';
import { loadBgImage, loadImages } from './helpers.js';
import { displayControls, displayDialog, hideDialog, populateControlsTip, populateMenu } from './menu.js';
import {createSingleObstacle} from './obstacles.js'
import { displayScore } from './score.js';
import { loadAudio, loadedAudio, playAudio, playTheme, stopTheme } from './sound.js';

const loader = document.querySelector('.loader-wrapper');
const canvas = document.querySelector('.playfield');
const bestScoreSpan = document.getElementById('best');
const scoreSpan = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
const width = canvas.width = canvasWidth;
const height = canvas.height = canvasHeight;
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'beige';
ctx.fillRect(0, 0, width, height);
ctx.translate(0, -height * 0.3);
console.log({canvasWidth, canvasHeight})

let isLoading = false;
let startGame = false; 
let isJumpPressed = false;
let isRunning = false;
let isIdle = false;
let isDead = false;
let sprite = 0;
let frame = 0;
let velocity = 5;
let deadAnimationplayed = false;
let score = 0;
let bestScore = 0;
let isNewBest = false;
let isRestart = false;
let posY = 0;
let loopId;

const imageRun = new Image();
imageRun.src = "images/character/Run.webp";
const imageIdle = new Image();
imageIdle.src = "images/character/Idle.webp";
const imageJump = new Image();
imageJump.src = "images/character/Jump.webp";
const imageDead = new Image();
imageDead.src = "images/character/Dead.webp";

document.addEventListener('keyup', (e) => {
  if (e.key === 'Enter' && !startGame && !isRestart) {
    startGameFn();
  }
});

startBtn.addEventListener('click', () => {
  startGameFn();
});

document.addEventListener('DOMContentLoaded', () => {
  for (let i = 0; i < maxObstaclesPerScreen; i++) {
    obstacleArray[i] = createSingleObstacle(obstacleArray, obstacleVelocity);
  }
  for (let i = 0; i < 2; i++) {
    bgArray[i] = createBgElement(env, i, backgroundVel, foregroundVel);
  }
  displayScore(scoreSpan, score);
  updateBestResult();
  populateControlsTip();
});

document.addEventListener('keydown', (e) => {
  if ((e.code === 'Space' || e.code === 'ArrowUp') && startGame && !isJumpPressed) {
    sprite = 0;
    isRunning = false;
    isJumpPressed = true;
    playAudio(loadedAudio.jump);
  }
});

document.addEventListener('touchstart', (e) => {
  if (e.target.classList.contains('playfield') && startGame && !isJumpPressed) {
    sprite = 0;
    isRunning = false;
    isJumpPressed = true;
  }
}, false);

document.addEventListener('DOMContentLoaded', () => {
  loader.classList.add('show-loader');
  isLoading = true;
  loadImages()
    .then(() => {
      loadAudio();
    })
    .then(() => {
      isIdle = true;
      loop();
    })
    .catch(error => {
      console.log('Error loading images:', error);
    })
    .finally(() => {
      isLoading = false;
      loader.classList.remove('show-loader');
    });
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'Escape') {
    console.log('abort');
    endGame('gameOver');
  }
});

function startGameFn() {
  startBtn.classList.remove('show-start-btn');
  resetSettings();
  displayScore(scoreSpan, score);
  updateBestResult();
  displayControls();
  playAudio(loadedAudio.click);
}

function restartGame() {
  env = 0;
  for (let i = 0; i < bgArray.length; i++) {
    bgArray[i].backgroundX = i * width;
    bgArray[i].foregroundX = i * width;
    loadBgImage(bgArray[i], env);
  }
  backgroundVel = initialBackgroundVel;
  foregroundVel = initialForegroundVel;
  obstacleArray = Array.from({length: maxObstaclesPerScreen});
  obstacleVelocity = 6;
  scoreFreq = 0;
  scoreVel = initScoreVel;
  level = 1;
  sprite = 0;
  frame = 0;
  
  for (let i = 0; i < maxObstaclesPerScreen; i++) {
    obstacleArray[i] = createSingleObstacle(obstacleArray, obstacleVelocity);
  }

  hideDialog();
  resetSettings();
  displayScore(scoreSpan, score);
  updateBestResult();
  displayControls();
  loop();
}

function resetSettings() {
  startGame = true;
  isRunning = true;
  isIdle = false;
  isDead = false;
  score = 0;
  isNewBest = false;
  deadAnimationplayed = false;
  playTheme();
}

function endGame(type) {
  startGame = false;
  window.cancelAnimationFrame(loopId);
  isRunning = false;
  isJumpPressed = false;
  isIdle = false;
  updateBestResult();
  stopTheme();
  if (isNewBest) {
    playAudio(loadedAudio.newRecord);
  } else {
    playAudio(loadedAudio.death);
  }
  setTimeout(() => {
    populateMenu(type, bestScore, score, isNewBest);
    displayDialog();
    isRestart = true;
    const restartBtn = document.getElementById('restart-btn');
    restartBtn.addEventListener('click', () => {
      restartGame();
      playAudio(loadedAudio.click);
    });
    document.addEventListener('keyup', (e) => {
      if ((e.code === 'Space' || e.key === 'Enter') && !startGame) {
        restartGame();
        playAudio(loadedAudio.click);
      }
    });
  }, 300);
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
      spriteXScaled, // the size of the image on the canvas (X)
      spriteYScaled // the size of the image on the canvas (Y)
    );

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
      Math.round(spriteXNoPadding * smallScreenCoefficient), // the size of the image on the canvas (X)
      Math.round(spriteYNoPadding * smallScreenCoefficient) // the size of the image on the canvas (Y)
    );
  
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
      Math.round(spriteXNoPadding * smallScreenCoefficient), // the size of the image on the canvas (X)
      Math.round(spriteYNoPadding * smallScreenCoefficient) // the size of the image on the canvas (Y)
    );
    
    slowFramerate(4, jumpSprites);
  
    // ascending and descending
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
      Math.round(spriteDeadXNoPadding * smallScreenCoefficient), // the size of the image on the canvas (X)
      Math.round(spriteYNoPadding * smallScreenCoefficient) // the size of the image on the canvas (Y)
    );

    // if animation has finished
    if (sprite >= deadSprites) {
      deadAnimationplayed = true;
    } else {
      slowFramerate(velocity, deadSprites);
      frame++;
    }
  }

  detectCollision(obstacleX, obstacleY) {
    if (obstacleX <= (this.x + (spriteXNoPadding * smallScreenCoefficient)) 
      && obstacleX >= this.x
      && obstacleY <= (this.y - posY + (spriteYNoPadding * smallScreenCoefficient))) {
        return true;
    }
    return false;
  }
}

const hero = new Hero(25, height - (spriteYNoPadding * smallScreenCoefficient));

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

function updateBestResult() {
  const currentBest = sessionStorage.getItem("best-score");
  if (!currentBest || (score > currentBest)) {
    bestScore = score;
    sessionStorage.removeItem("best-score");
    sessionStorage.setItem("best-score", bestScore);
    isNewBest = true;
  } else {
    bestScore = currentBest;
  }
  displayScore(bestScoreSpan, bestScore);
}

let obstacleArray = Array.from({length: maxObstaclesPerScreen});
let obstacleVelocity = 6;
let scoreFreq = 0;
let scoreVel = initScoreVel;
let level = 1;

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
      playAudio(loadedAudio.newLevel);
    }
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
let bgArray = [];
let replacedImgs = 0;
let shouldUpdateBg = false;
let env = 0;

function loop() {
  ctx.fillRect(0, 0, width, height);

  // change bg images
  if (!shouldUpdateBg && score > 0 && (score % nextEnvScorePoint === 0)) {
    shouldUpdateBg = true;
    if (env + 1 < levelsEnv.length) {
      env++;
    } else {
      env = 0;
    }
  }
  
  // all the backgrounds should be drawn first, otherwise the velocity discrepancy
  // will eventually cause background to cover foreground 
  for (let i = 0; i < bgArray.length; i++) {
    bgArray[i].drawBackground(ctx, bgArray[i].skyBg);
    bgArray[i].drawBackground(ctx, bgArray[i].groundBg);
  }

  for (let i = 0; i < bgArray.length; i++) {
    bgArray[i].drawForeground(ctx, bgArray[i].skyBgObj);
    bgArray[i].drawForeground(ctx, bgArray[i].groundBgObj);
    
    if ((bgArray[i].backgroundX + width) <= 0) {
      bgArray[i].backgroundX = width;
    }
    if ((bgArray[i].foregroundX + width) <= 0) {
      bgArray[i].foregroundX = width;
    }
    if (shouldUpdateBg) {
      loadNextLvlImgs(bgArray[i]);
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
      obstacleArray[i].updateObstacle();
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

function loadNextLvlImgs(bgElem) {
  if (bgElem.backgroundX === width) {
    loadBgImage(bgElem, env);
    replacedImgs++;
  }
  if (replacedImgs === bgArray.length) {
    replacedImgs = 0;
    shouldUpdateBg = false;
  }
}
