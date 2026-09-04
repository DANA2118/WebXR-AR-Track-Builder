import { GAME_CONFIG } from '../config/gameConfig.js';
import { findConeCollision } from './collisionManager.js';
import { findTrackEnd, getRoads, isCarOnRoad, createFinishLine } from './trackManager.js';
import { startEngine, stopEngine, playCrashSound } from '../audio/audioManager.js';
import { getBestTime, saveBestTime } from '../storage/scoreManager.js';
import {
  flashScreen,
  hideResult,
  showResult,
  updateBestTime,
  updateHitCount,
  updateStatus,
  updateTimer
} from '../ui/hudManager.js';
import { runCountdown } from '../ui/countdownManager.js';

export class RaceManager {
  constructor({ container, raceElements, placementManager, steeringManager }) {
    this.container = container;
    this.raceElements = raceElements;
    this.placementManager = placementManager;
    this.steeringManager = steeringManager;
    this.steeringControls = document.getElementById('steering-controls');

    this.state = 'BUILD';
    this.currentSpeed = GAME_CONFIG.initialSpeed;
    this.raceStartTime = 0;
    this.previousFrameTime = 0;
    this.penaltySeconds = 0;
    this.coneHits = 0;
    this.finish = null;
    this.startPosition = null;
    this.animationFrame = null;

    updateBestTime(getBestTime());
  }

  isRacing() {
    return this.state === 'RACING' || this.state === 'COUNTDOWN';
  }

  setSpeed(speed) {
    this.currentSpeed = speed;
  }

  async start() {
    if (this.state !== 'BUILD') return;

    const car = this.placementManager.getCar();
    if (!car) {
      updateStatus('PLACE A CAR FIRST');
      return;
    }

    if (getRoads(this.container).length === 0) {
      updateStatus('BUILD A ROAD FIRST');
      return;
    }

    const floorY = this.placementManager.getFloorY();
    this.finish = findTrackEnd(this.container);
    createFinishLine(this.raceElements, this.finish, floorY);

    this.startPosition = {
      x: car.object3D.position.x,
      y: car.object3D.position.y,
      z: car.object3D.position.z
    };

    this.penaltySeconds = 0;
    this.coneHits = 0;
    updateTimer(0);
    updateHitCount(0);
    hideResult();

    this.state = 'COUNTDOWN';
    updateStatus('GET READY');
    await runCountdown();

    this.beginRace();
  }

  beginRace() {
    this.state = 'RACING';
    updateStatus('RACING');
    this.steeringControls.style.display = 'flex';
    this.raceStartTime = performance.now();
    this.previousFrameTime = this.raceStartTime;
    startEngine();
    this.animationFrame = requestAnimationFrame((timestamp) => this.update(timestamp));
  }

  update(timestamp) {
    if (this.state !== 'RACING') return;

    const car = this.placementManager.getCar();
    if (!car) {
      this.finishRace((timestamp - this.raceStartTime) / 1000 + this.penaltySeconds);
      return;
    }

    const deltaTime = Math.min((timestamp - this.previousFrameTime) / 1000, 0.05);
    this.previousFrameTime = timestamp;

    if (this.steeringManager.left) {
      car.object3D.position.x -= GAME_CONFIG.steeringSpeed * deltaTime;
    }

    if (this.steeringManager.right) {
      car.object3D.position.x += GAME_CONFIG.steeringSpeed * deltaTime;
    }

    const onRoad = isCarOnRoad(car, this.container);
    const speedMultiplier = onRoad ? 1 : GAME_CONFIG.offRoadSpeedMultiplier;
    if (!onRoad) updateStatus('OFF ROAD!');
    else updateStatus('RACING');

    car.object3D.position.z -= this.currentSpeed * speedMultiplier * deltaTime;

    const hitCone = findConeCollision(car, this.container, timestamp);
    if (hitCone) {
      this.coneHits += 1;
      this.penaltySeconds += GAME_CONFIG.collisionPenalty;
      updateHitCount(this.coneHits);
      updateStatus(`+${GAME_CONFIG.collisionPenalty}s PENALTY!`);
      playCrashSound();
      flashScreen();
    }

    const raceSeconds = (timestamp - this.raceStartTime) / 1000;
    const displayedTime = raceSeconds + this.penaltySeconds;
    updateTimer(displayedTime);

    if (this.finish && car.object3D.position.z <= this.finish.z) {
      this.finishRace(displayedTime);
      return;
    }

    this.animationFrame = requestAnimationFrame((nextTimestamp) => this.update(nextTimestamp));
  }

  finishRace(finalTime) {
    this.state = 'FINISHED';
    stopEngine();
    this.steeringControls.style.display = 'none';
    this.steeringManager.reset();

    const score = Math.max(
      0,
      Math.round(
        GAME_CONFIG.scoreBase -
        finalTime * GAME_CONFIG.scoreTimeWeight -
        this.coneHits * GAME_CONFIG.scoreHitPenalty
      )
    );

    const newBest = saveBestTime(finalTime);
    updateBestTime(getBestTime());
    updateStatus(newBest ? 'NEW BEST TIME!' : 'FINISHED!');

    showResult({
      time: finalTime,
      hits: this.coneHits,
      penalty: this.penaltySeconds,
      score
    });
  }

  resetRace() {
    const car = this.placementManager.getCar();
    if (!car || !this.startPosition) return;

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    stopEngine();
    car.object3D.position.set(
      this.startPosition.x,
      this.startPosition.y,
      this.startPosition.z
    );

    this.penaltySeconds = 0;
    this.coneHits = 0;
    this.steeringManager.reset();
    this.steeringControls.style.display = 'none';
    updateTimer(0);
    updateHitCount(0);
    hideResult();
    this.state = 'BUILD';
    updateStatus('READY TO RACE');
  }

  clearAll() {
    if (this.isRacing()) return;

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    stopEngine();
    this.placementManager.clear();
    this.raceElements.innerHTML = '';
    this.finish = null;
    this.startPosition = null;
    this.penaltySeconds = 0;
    this.coneHits = 0;
    this.state = 'BUILD';
    this.steeringManager.reset();
    this.steeringControls.style.display = 'none';
    updateTimer(0);
    updateHitCount(0);
    hideResult();
    updateStatus('BUILD MODE');
  }
}
