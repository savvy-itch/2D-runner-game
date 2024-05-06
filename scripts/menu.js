import { controlsTipHtml, menuHtml } from "./config.js";

const dialogWindow = document.getElementById('dialog');
const controlsDiv = document.getElementById('controls-tip');

export function populateMenu(type, bestScore, score, isNewBest) {
  let content;
  if (type === 'gameBeaten') {
    content = menuHtml.gameBeaten;
    dialogWindow.innerHTML = content;
  } else if (type === 'gameOver') {
    content = menuHtml.gameOver;
    dialogWindow.innerHTML = content;

    if (isNewBest) {
      const newBestPara = document.createElement('p');
      newBestPara.classList.add('new-record');
      newBestPara.textContent = 'New Record!';
      const bestRecordWrapper = dialogWindow.querySelector('.best-record-wrapper');
      bestRecordWrapper.insertAdjacentElement('afterbegin', newBestPara);
    }

    const bestRecordElem = document.getElementById('dialog-best-record');
    bestRecordElem.textContent = bestScore;
    const scoreElem = document.getElementById('dialog-score');
    scoreElem.textContent = score;
  }
}

export function displayDialog() {
  dialogWindow.classList.add('show-dialog');
}

export function hideDialog() {
  dialogWindow.classList.remove('show-dialog');
}

export function populateControlsTip() {
  if (window.innerWidth > 1024) {
    controlsDiv.innerHTML = controlsTipHtml.keyboard;
  } else {
    controlsDiv.innerHTML = controlsTipHtml.touchScreen;
  }
}

export function displayControls() {
  controlsDiv.classList.add('show-controls-tip');
  setTimeout(() => {
    controlsDiv.classList.remove('show-controls-tip');
  }, 1000);
}
