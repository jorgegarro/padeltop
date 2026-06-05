const KEY = 'padeltop_tournament';

export function saveTournament(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (_) {}
}

export function loadTournament() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

export function clearTournament() {
  localStorage.removeItem(KEY);
}
