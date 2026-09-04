const timerElement = document.getElementById('timer');
const hitCountElement = document.getElementById('hit-count');
const statusElement = document.getElementById('race-status');
const bestTimeElement = document.getElementById('best-time');
const resultPanel = document.getElementById('result-panel');

export function updateTimer(time) {
  timerElement.textContent = time.toFixed(2);
}

export function updateHitCount(count) {
  hitCountElement.textContent = String(count);
}

export function updateStatus(message) {
  statusElement.textContent = message;
}

export function updateBestTime(time) {
  bestTimeElement.textContent = time === null ? '--' : `${time.toFixed(2)}s`;
}

export function showResult({ time, hits, penalty, score }) {
  document.getElementById('final-time').textContent = time.toFixed(2);
  document.getElementById('final-hits').textContent = String(hits);
  document.getElementById('final-penalty').textContent = String(penalty);
  document.getElementById('final-score').textContent = String(score);
  resultPanel.style.display = 'block';
}

export function hideResult() {
  resultPanel.style.display = 'none';
}

export function flashScreen() {
  const flash = document.createElement('div');
  flash.style.cssText = 'position:fixed;inset:0;background:red;opacity:0.48;pointer-events:none;z-index:9998;';
  document.getElementById('overlay').appendChild(flash);
  setTimeout(() => flash.remove(), 250);
}
