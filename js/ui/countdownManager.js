const countdownElement = document.getElementById('countdown');

export function runCountdown() {
  return new Promise((resolve) => {
    let value = 3;
    countdownElement.style.display = 'block';
    countdownElement.textContent = String(value);

    const interval = setInterval(() => {
      value -= 1;

      if (value > 0) {
        countdownElement.textContent = String(value);
        return;
      }

      if (value === 0) {
        countdownElement.textContent = 'GO!';
        return;
      }

      clearInterval(interval);
      countdownElement.style.display = 'none';
      resolve();
    }, 1000);
  });
}
