import { levelsEnv, obstacles } from "./config.js";

export function getRandom(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
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
      loadImage(window.innerWidth > 500 ? levelsEnv[i].skyBg.lg : levelsEnv[i].skyBg.sm);
      loadImage(levelsEnv[0].skyBgObj);
      loadImage(levelsEnv[i].groundBg);
      loadImage(levelsEnv[0].groundBgObj);
    }

    for (let i = 0; i < obstacles.length; i++) {
      loadImage(obstacles[i].imgSrc);
    }
  });
};

export function loadBgImage(bgElem, env) {
  const skyBg = new Image();
  skyBg.src = window.innerWidth > 500 ? levelsEnv[env].skyBg.lg : levelsEnv[env].skyBg.sm;
  bgElem.skyBg = skyBg;
  const groundBg = new Image();
  groundBg.src = levelsEnv[env].groundBg;
  bgElem.groundBg = groundBg;
}
