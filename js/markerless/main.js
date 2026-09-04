import { PlacementManager } from './placementManager.js';
import { RaceManager } from '../game/raceManager.js';
import { SteeringManager } from '../game/steeringManager.js';
import { updateStatus } from '../ui/hudManager.js';

const scene = document.querySelector('a-scene');
const reticle = document.getElementById('reticle');
const container = document.getElementById('placed-pieces');
const raceElements = document.getElementById('race-elements');
const speedSlider = document.getElementById('speed-slider');
const raceButton = document.getElementById('race-btn');
const retryButton = document.getElementById('retry-btn');
const clearButton = document.getElementById('clear-btn');

const placementManager = new PlacementManager(reticle, container);
const steeringManager = new SteeringManager(
  document.getElementById('left-btn'),
  document.getElementById('right-btn')
);

const raceManager = new RaceManager({
  container,
  raceElements,
  placementManager,
  steeringManager
});

let buttonJustPressed = false;

function markUiInteraction() {
  buttonJustPressed = true;
  window.setTimeout(() => {
    buttonJustPressed = false;
  }, 300);
}

document.querySelectorAll('button, input, a').forEach((element) => {
  element.addEventListener('pointerdown', markUiInteraction);
});

document.querySelectorAll('.piece-btn').forEach((button) => {
  button.addEventListener('click', () => {
    if (raceManager.isRacing()) return;

    document.querySelectorAll('.piece-btn').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    const type = button.dataset.type;
    placementManager.setCurrentType(type);
    updateStatus(`PLACE ${type.replace('-model', '').toUpperCase()}`);
  });
});

scene.addEventListener('ar-hit-test-select', () => {
  if (raceManager.isRacing() || buttonJustPressed) return;
  placementManager.placeObject();
});

speedSlider.addEventListener('input', (event) => {
  raceManager.setSpeed(Number(event.target.value));
});

raceButton.addEventListener('click', () => raceManager.start());
retryButton.addEventListener('click', () => raceManager.resetRace());
clearButton.addEventListener('click', () => raceManager.clearAll());
