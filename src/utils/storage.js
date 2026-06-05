const KEY = 'padeltop_tournament';

/**
 * Persist the tournament to localStorage.
 * @param {unknown} data
 * @returns {boolean} true if the write succeeded, false otherwise.
 */
export function saveTournament(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    // Writes can fail on quota-exceeded or in restricted/private browsing modes.
    // Don't crash the app, but surface it instead of failing silently.
    console.error('Failed to save tournament:', err);
    return false;
  }
}

/**
 * Load the persisted tournament, or null if none/unreadable.
 * @returns {unknown | null}
 */
export function loadTournament() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn('Failed to load saved tournament, starting fresh:', err);
    return null;
  }
}

export function clearTournament() {
  localStorage.removeItem(KEY);
}
