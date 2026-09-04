let audioContext = null;
let engineOscillator = null;
let engineGain = null;

function getAudioContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioContext = new AudioContextClass();
    }
  }
  return audioContext;
}

export async function startEngine() {
  const context = getAudioContext();
  if (!context || engineOscillator) return;

  if (context.state === 'suspended') {
    await context.resume();
  }

  engineOscillator = context.createOscillator();
  engineGain = context.createGain();

  engineOscillator.type = 'sawtooth';
  engineOscillator.frequency.value = 75;
  engineGain.gain.value = 0.025;

  engineOscillator.connect(engineGain);
  engineGain.connect(context.destination);
  engineOscillator.start();
}

export function stopEngine() {
  if (engineOscillator) {
    try { engineOscillator.stop(); } catch (_) {}
    engineOscillator.disconnect();
    engineOscillator = null;
  }

  if (engineGain) {
    engineGain.disconnect();
    engineGain = null;
  }
}

export async function playCrashSound() {
  const context = getAudioContext();
  if (!context) return;

  if (context.state === 'suspended') {
    await context.resume();
  }

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(160, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(55, context.currentTime + 0.22);
  gain.gain.setValueAtTime(0.18, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.24);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.25);
}
