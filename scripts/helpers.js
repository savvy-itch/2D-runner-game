import { levelsEnv, obstacles, scoreCharsAmount } from "./config.js";

export function getRandom(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

export function displayScore(HTMLelement, score) {
  HTMLelement.textContent = String(score).padStart(scoreCharsAmount, '0');
}

export function loadImages() {
  return new Promise((res, rej) => {
    let loadedImgs = 0;
    let totalImgs = obstacles.length + (levelsEnv.length * 4);

    const checkAllImgsLoaded = () => {
      if (loadedImgs === totalImgs) {
        res();
      }
    }

    const loadImage = (src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedImgs++;
        checkAllImgsLoaded();
      }
      img.onerror = () => {
        rej(new Error('Failed to load image: ' + src));
      };
    };

    for (let i = 0; i < levelsEnv.length; i++) {
      loadImage(levelsEnv[i].skyBg);
      loadImage(levelsEnv[0].skyBgObj);
      loadImage(levelsEnv[i].groundBg);
      loadImage(levelsEnv[0].groundBgObj);
    }

    for (let i = 0; i < obstacles.length; i++) {
      loadImage(obstacles[i].imgSrc);
    }
  });
};