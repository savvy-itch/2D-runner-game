import {spriteX, spriteY, idleVelocity, jumpSprites, offsetPerFrame} from './config.js';

const canvas = document.querySelector('.playfield');
const width = canvas.width = 600;
const height = canvas.height = 400;
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'beige';
ctx.fillRect(0,0,width,height);
ctx.translate(0, height / 2);

let isJumpPressed = false;
let sprite = 0;
let frame = 0;
let velocity = 5;
let startGame = false;

const imageRun = new Image();
imageRun.src = "../images/Run.png";
let runId;
document.addEventListener('keyup', (e) => {
  if (e.key === 'Enter' && !startGame) {
    startGame = true;
    window.cancelAnimationFrame(idleId);
    runId = window.requestAnimationFrame(drawRun);
  }
});

const imageIdle = new Image();
imageIdle.src = "../images/Idle.png";
let idleId;
imageIdle.onload = () => {
  idleId = window.requestAnimationFrame(drawIdle);
};

const imageJump = new Image();
imageJump.src = "../images/Jump.png";
let jumpId;
document.addEventListener('keydown', (e) => {
  if ((e.code === 'Space' || e.code === 'ArrowUp') && startGame && !isJumpPressed) {
    window.cancelAnimationFrame(runId);
    sprite = 0;
    isJumpPressed = true;
    jumpId = window.requestAnimationFrame(drawJump);
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'Escape') {
    console.log('abort')
    window.cancelAnimationFrame(idleId);
    window.cancelAnimationFrame(jumpId);
    window.cancelAnimationFrame(runId);
    startGame = false;
  }
})

function drawIdle() {
  if (sprite === 0) console.log('drawIdle');

  ctx.fillRect(-(width / 2), -(height / 2), width, height);
  ctx.drawImage(
    imageIdle, 
    sprite * spriteX, // top-left corner of the slice to cut out (X)
    0, // top-left corner of the slice to cut out (Y)
    spriteX, // the size of the slice to cut out (X)
    spriteY, // the size of the slice to cut out (Y)
    0, // top-left corner of canvas box into which to draw the slice (X)
    -64, // top-left corner of canvas box into which to draw the slice (Y)
    128, // the size of the image on the canvas (X)
    128 // the size of the image on the canvas (Y)
  );

  slowFramerate(idleVelocity, 4);

  frame++;

  idleId = window.requestAnimationFrame(drawIdle);
}

function drawRun() {
  if (sprite === 0) console.log('drawRun');

  ctx.fillRect(-(width / 2), -(height / 2), width, height);
  ctx.drawImage(
    imageRun, 
    sprite * spriteX, // top-left corner of the slice to cut out (X)
    0, // top-left corner of the slice to cut out (Y)
    spriteX, // the size of the slice to cut out (X)
    spriteY, // the size of the slice to cut out (Y)
    0, // top-left corner of canvas box into which to draw the slice (X)
    -64, // top-left corner of canvas box into which to draw the slice (Y)
    128, // the size of the image on the canvas (X)
    128 // the size of the image on the canvas (Y)
  );

  slowFramerate(velocity, 7);

  frame++;

  runId = window.requestAnimationFrame(drawRun);
}

let posY = 0;

function drawJump() {
  if (sprite === 0) console.log('drawJump');

  ctx.fillRect(-(width / 2), -(height / 2), width, height);
  ctx.drawImage(
    imageJump,
    sprite * spriteX, // top-left corner of the slice to cut out (X)
    0, // top-left corner of the slice to cut out (Y)
    spriteX, // the size of the slice to cut out (X)
    spriteY, // the size of the slice to cut out (Y)
    0, // top-left corner of canvas box into which to draw the slice (X)
    -64 - posY, // top-left corner of canvas box into which to draw the slice (Y)
    128, // the size of the image on the canvas (X)
    128 // the size of the image on the canvas (Y)
  );
  
  slowFramerate(velocity, jumpSprites);

  // accending and descending
  if (sprite < Math.ceil(jumpSprites / 2)) {
    posY = sprite * offsetPerFrame;
  } else {
    posY = (jumpSprites - sprite) * offsetPerFrame;
  }

  // console.log(sprite, posY);

  frame++;
  
  // end of the jump
  if (sprite === jumpSprites) {
    sprite = 0;
    frame = 0;
    window.cancelAnimationFrame(jumpId);
    isJumpPressed = false;
    drawRun();
  } else {
    window.requestAnimationFrame(drawJump);
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
