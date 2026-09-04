export class PlacementManager {
  constructor(reticle, container) {
    this.reticle = reticle;
    this.container = container;
    this.floorY = null;
    this.currentType = 'track-model';
    this.lastCar = null;
  }

  setCurrentType(type) {
    this.currentType = type;
  }

  getCar() {
    return this.lastCar;
  }

  getFloorY() {
    return this.floorY;
  }

  placeObject() {
    const position = this.reticle.object3D.position;

    if (this.floorY === null) {
      this.floorY = position.y;
    }

    const piece = document.createElement('a-entity');
    piece.setAttribute('gltf-model', `#${this.currentType}`);
    piece.setAttribute('data-piece-type', this.currentType);

    if (this.currentType === 'car-model') {
      if (this.lastCar && this.lastCar.parentNode) {
        this.lastCar.remove();
      }

      piece.setAttribute('scale', '0.001 0.001 0.001');
      piece.setAttribute('rotation', '0 180 0');
      piece.setAttribute('position', `${position.x} ${this.floorY + 0.05} ${position.z}`);
      this.lastCar = piece;
    } else {
      piece.setAttribute('position', `${position.x} ${this.floorY} ${position.z}`);
    }

    piece.addEventListener('model-error', (event) => {
      console.error(`${this.currentType} failed to load`, event.detail);
    });

    this.container.appendChild(piece);
    return piece;
  }

  clear() {
    this.container.innerHTML = '';
    this.floorY = null;
    this.lastCar = null;
    this.currentType = 'track-model';
  }
}
