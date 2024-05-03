import { scoreCharsAmount } from "./config.js";

export function displayScore(HTMLelement, score) {
  HTMLelement.textContent = String(score).padStart(scoreCharsAmount, '0');
}
