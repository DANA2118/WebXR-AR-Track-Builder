const target =
  document.getElementById(
    'lamborghini-target'
  );


const trackingStatus =
  document.getElementById(
    'tracking-status'
  );


const markerMessage =
  document.getElementById(
    'marker-message'
  );


const startRaceButton =
  document.getElementById(
    'start-race-btn'
  );


const markerCar =
  document.getElementById(
    'marker-car'
  );


startRaceButton.style.display =
  'none';

target.addEventListener(
  'targetFound',
  () => {

    console.log(
      'Lamborghini marker detected'
    );


    trackingStatus.textContent =
      '✓ Lamborghini marker detected';


    trackingStatus.classList.remove(
      'tracking-searching'
    );


    trackingStatus.classList.add(
      'tracking-found'
    );


    markerMessage.textContent =
      'AR Racing Challenge Ready!';


    startRaceButton.style.display =
      'block';


    animateCar();

  }
);

target.addEventListener(
  'targetLost',
  () => {

    console.log(
      'Lamborghini marker lost'
    );


    trackingStatus.textContent =
      'Searching for marker...';


    trackingStatus.classList.remove(
      'tracking-found'
    );


    trackingStatus.classList.add(
      'tracking-searching'
    );


    markerMessage.textContent =
      'Point your camera at the Lamborghini marker';


    startRaceButton.style.display =
      'none';

  }
);

function animateCar() {

  if (!markerCar) {
    return;
  }


  markerCar.setAttribute(
    'animation__rotation',
    {
      property:
        'rotation',

      from:
        '0 180 0',

      to:
        '0 540 0',

      dur:
        6000,

      easing:
        'linear',

      loop:
        true
    }
  );

}