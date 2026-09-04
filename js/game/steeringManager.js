export class SteeringManager {
  constructor(leftButton, rightButton) {
    this.left = false;
    this.right = false;
    this.leftButton = leftButton;
    this.rightButton = rightButton;
    this.bind();
  }

  bindButton(button, key) {
    const start = (event) => {
      event.preventDefault();
      this[key] = true;
    };

    const stop = () => {
      this[key] = false;
    };

    button.addEventListener('pointerdown', start);
    button.addEventListener('pointerup', stop);
    button.addEventListener('pointerleave', stop);
    button.addEventListener('pointercancel', stop);
  }

  bind() {
    this.bindButton(this.leftButton, 'left');
    this.bindButton(this.rightButton, 'right');
  }

  reset() {
    this.left = false;
    this.right = false;
  }
}
