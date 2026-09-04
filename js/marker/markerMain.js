const marker = document.getElementById('race-marker');
const car = document.getElementById('marker-car');
const status = document.getElementById('marker-status');

let animationFrame = null;
let lastTime = performance.now();

function animate(time) {
  const deltaSeconds = (time - lastTime) / 1000;
  lastTime = time;

  if (car) {
    car.object3D.rotation.y += deltaSeconds * 0.8;
    const bob = 0.15 + Math.sin(time / 450) * 0.025;
    car.object3D.position.y = bob;
  }

  animationFrame = requestAnimationFrame(animate);
}

marker.addEventListener('markerFound', () => {
  status.textContent = 'Marker detected — race car activated';
  lastTime = performance.now();
  if (!animationFrame) {
    animationFrame = requestAnimationFrame(animate);
  }
});

marker.addEventListener('markerLost', () => {
  status.textContent = 'Marker lost — show the Hiro marker again';
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
});
