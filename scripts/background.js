import { canvasHeight, canvasWidth } from "./config.js";

export class Background {
  constructor(backgroundX, foregroundX, backgroundVel, foregroundVel) {
    this.backgroundX = backgroundX;
    this.foregroundX = foregroundX;
    this.backgroundVel = backgroundVel;
    this.foregroundVel = foregroundVel;
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
