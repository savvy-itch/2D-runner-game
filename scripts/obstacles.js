import {
  spriteX,
  obstacles,
  minDistanceBetweenObstacles,
  canvasWidth,
  canvasHeight,
} from './config.js';
import {getRandom} from './helpers.js';

export class Obstacle {
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

  drawObstacle(ctx) {
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
    // ctx.strokeRect(this.x, this.y, this.sizeX, this.sizeY);
  }

  updateObstacle(ctx) {
    this.x -= this.vel;
    // ctx.strokeRect(this.x, this.y, this.sizeX, this.sizeY);

    // if the obstacle reached the right edge of the screen, start drawing it
    if (this.x <= canvasWidth && !this.isVisible) {
      this.isVisible = true;
    } else if (this.x <= (-this.sizeX)) {
      // when an obstacle moves off-screen
      this.isPassed = true;
      this.isVisible = false;
    }
  }
}

export function createSingleObstacle(obstacleArray, obstacleVelocity) {
  const obstacleObj = {};
  const obstacleImg = new Image();
  const idx = getRandom(0, obstacles.length - 1);
  obstacleImg.src = obstacles[idx].imgSrc;
  
  // Use the farthest obstacle x as minimum x for the new obstacle
  let farthestObstacle = obstacleArray[0] ? obstacleArray[0].x : canvasWidth;
  obstacleArray.forEach(item => {
    if (item && (item.x > (farthestObstacle + spriteX + minDistanceBetweenObstacles))) {
      farthestObstacle = item.x + item.sizeX;
    }
  });
  const minX = spriteX + minDistanceBetweenObstacles + (farthestObstacle ? farthestObstacle : canvasWidth);
  let maxX = (canvasWidth * 2.5) - minDistanceBetweenObstacles;
  if (minX > maxX) {
    maxX += farthestObstacle;
  }

  const distance = getRandom(minX, maxX);
  obstacleObj.isPassed = false;
  obstacleObj.isVisible = false;
  obstacleObj.x = distance;
  obstacleObj.y = canvasHeight - obstacles[idx].sizeY;
  const obstacle = new Obstacle(obstacleObj.isPassed, obstacleObj.isVisible, obstacleImg, obstacleObj.x, obstacleObj.y, obstacles[idx].sizeX, obstacles[idx].sizeY, obstacleVelocity);
  return obstacle;
}
