import { GAME_CONFIG } from '../config/gameConfig.js';

export function findConeCollision(car, container, now = performance.now()) {
  const cones = container.querySelectorAll('[data-piece-type="cone-model"]');

  for (const cone of cones) {
    const carPosition = car.object3D.position;
    const conePosition = cone.object3D.position;
    const dx = carPosition.x - conePosition.x;
    const dz = carPosition.z - conePosition.z;
    const distance = Math.hypot(dx, dz);

    if (distance >= GAME_CONFIG.collisionDistance) continue;

    const previousHit = Number(cone.dataset.lastHit || 0);
    if (now - previousHit < GAME_CONFIG.collisionCooldownMs) continue;

    cone.dataset.lastHit = String(now);
    return cone;
  }

  return null;
}
