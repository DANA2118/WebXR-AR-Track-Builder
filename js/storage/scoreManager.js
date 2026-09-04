const BEST_TIME_KEY = 'arRaceBestTime';

export function getBestTime() {
  const raw = localStorage.getItem(BEST_TIME_KEY);
  return raw === null ? null : Number(raw);
}

export function saveBestTime(time) {
  const current = getBestTime();

  if (current === null || time < current) {
    localStorage.setItem(BEST_TIME_KEY, String(time));
    return true;
  }

  return false;
}
