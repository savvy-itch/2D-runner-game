const canvas = document.querySelector('.playfield');
const width = canvas.width = 600;
const height = canvas.height = 400;
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'beige';
ctx.fillRect(0,0,width,height);
ctx.translate(0, height / 2);

const spriteX = 128;
const spriteY = 128;

let sprite = 0;
let frame = 0;
let velocity = 5;
const idleVelocity = 13;
let startGame = false;

const imageRun = new Image();
imageRun.src = "../images/Run.png";
document.addEventListener('keyup', (e) => {
  if (e.key === 'Enter' && !startGame) {
    startGame = true;
    drawRun();
  }
});

const imageIdle = new Image();
imageIdle.src = "../images/Idle.png";
imageIdle.onload = drawIdle;

const imageJump = new Image();
imageJump.src = "../images/Jump.png";
// document.addEventListener('keypress', (e) => {
//   if ((e.code === 'Space' || e.code === 'ArrowUp') && startGame) {
//     drawJump();
//   }
// });

function drawIdle() {
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

  if (frame % idleVelocity === 0) {
    if (sprite === 4) {
      sprite = 0;
      frame = 0;
    } else {
      sprite++;
    }
  }

  frame++;

  window.requestAnimationFrame(drawIdle);
}

function drawRun() {
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

  if (frame % velocity === 0) {
    if (sprite === 7) {
      sprite = 0;
      frame = 0;
    } else {
      sprite++;
    }
  }

  frame++;

  window.requestAnimationFrame(drawRun);
}

let posY = 0;
const jumpSprites = 7;
function drawJump() {
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

  if (frame % velocity === 0) {
    if (sprite === jumpSprites) {
      sprite = 0;
      frame = 0;
    } else {
      sprite++;
    }
  }

  // add condition to jump only once at a time (no jumps mid air)

  // if (posY > spriteY / 2) {
  //   posY -= spriteY / Math.floor(jumpSprites / 2);
  // } else {
  //   posY += spriteY / Math.floor(jumpSprites / 2);
  // }

  frame++;

  window.requestAnimationFrame(drawJump);
}
