import { GAME_CONFIG } from '../config/gameConfig.js';

export function getRoads(container) {
  return Array.from(container.querySelectorAll('[data-piece-type="track-model"]'));
}

export function findTrackEnd(container) {
  const roads = getRoads(container);
  if (roads.length === 0) return null;

  let finishRoad = roads[0];
  let finishZ = finishRoad.object3D.position.z - GAME_CONFIG.roadLength / 2;

  for (const road of roads) {
    const candidate = road.object3D.position.z - GAME_CONFIG.roadLength / 2;
    if (candidate < finishZ) {
      finishZ = candidate;
      finishRoad = road;
    }
  }

  return {
    z: finishZ,
    x: finishRoad.object3D.position.x,
    road: finishRoad
  };
}

export function getRoadUnderCar(car, container) {
  const carPosition = car.object3D.position;
  const roads = getRoads(container);

  let closestRoad = null;
  let closestDistance = Infinity;

  for (const road of roads) {
    const roadPosition = road.object3D.position;
    const zDistance = Math.abs(carPosition.z - roadPosition.z);

    if (zDistance <= GAME_CONFIG.roadLength / 2 && zDistance < closestDistance) {
      closestRoad = road;
      closestDistance = zDistance;
    }
  }

  return closestRoad;
}

export function isCarOnRoad(car, container) {
  const road = getRoadUnderCar(car, container);
  if (!road) return false;

  return Math.abs(car.object3D.position.x - road.object3D.position.x) <= GAME_CONFIG.roadHalfWidth;
}

export function createFinishLine(raceElements, finish, floorY) {
  raceElements.innerHTML = '';
  if (!finish) return;

  const line = document.createElement('a-box');
  line.setAttribute('width', String(GAME_CONFIG.roadHalfWidth * 2));
  line.setAttribute('height', '0.015');
  line.setAttribute('depth', '0.08');
  line.setAttribute('color', '#FFFFFF');
  line.setAttribute('position', `${finish.x} ${floorY + 0.015} ${finish.z}`);
  raceElements.appendChild(line);

  const label = document.createElement('a-text');
  label.setAttribute('value', 'FINISH');
  label.setAttribute('align', 'center');
  label.setAttribute('color', '#FFFFFF');
  label.setAttribute('width', '1.5');
  label.setAttribute('position', `${finish.x} ${floorY + 0.36} ${finish.z}`);
  label.setAttribute('rotation', '-90 0 0');
  raceElements.appendChild(label);
}
