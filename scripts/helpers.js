import { scoreCharsAmount } from "./config.js";

export function getRandom(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

export function displayScore(HTMLelement, score) {
  HTMLelement.textContent = String(score).padStart(scoreCharsAmount, '0');
}