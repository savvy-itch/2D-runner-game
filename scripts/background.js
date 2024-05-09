import { canvasHeight, canvasWidth, levelsEnv } from "./config.js";

export class Background {
  constructor(
    backgroundX, 
    foregroundX, 
    backgroundVel, 
    foregroundVel, 
    skyBg, 
    skyBgObj, 
    groundBg, 
    groundBgObj
  ) {
    this.backgroundX = backgroundX;
    this.foregroundX = foregroundX;
    this.backgroundVel = backgroundVel;
    this.foregroundVel = foregroundVel;
    this.skyBg = skyBg;
    this.skyBgObj = skyBgObj;
    this.groundBg = groundBg;
    this.groundBgObj = groundBgObj;
  }

  drawBackground(ctx, img) {
    ctx.drawImage(
      img, 
      this.backgroundX, // top-left corner of the slice to cut out (X)
      0, // top-left corner of the slice to cut out (Y)
      canvasWidth,
      canvasHeight * 1.3
    );
  }

  drawForeground(ctx, img) {
    ctx.drawImage(
      img, 
      this.foregroundX, // top-left corner of the slice to cut out (X)
      0, // top-left corner of the slice to cut out (Y)
      canvasWidth,
      canvasHeight * 1.3
    );
  }

  updateBg() {
    this.backgroundX -= this.backgroundVel;
    this.foregroundX -= this.foregroundVel;
  }
}

export function createBgElement(env, i, backgroundVel, foregroundVel) {
  const skyBg = new Image();
  skyBg.src = window.innerWidth > 500 ? levelsEnv[env].skyBg.lg : levelsEnv[env].skyBg.sm;
  const groundBg = new Image();
  groundBg.src = levelsEnv[env].groundBg;
  const skyBgObj = new Image();
  skyBgObj.src = levelsEnv[0].skyBgObj;
  const groundBgObj = new Image();
  groundBgObj.src = levelsEnv[0].groundBgObj;
  const background = new Background(
    (canvasWidth * i), 
    (canvasWidth * i),
    backgroundVel,
    foregroundVel,
    skyBg, 
    skyBgObj, 
    groundBg, 
    groundBgObj
  );
  return background;
}
