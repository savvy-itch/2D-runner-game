import { menuHtml } from "./config.js";

const dialogWindow = document.getElementById('dialog');

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