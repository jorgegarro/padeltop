const TOURNAMENT_KEY = 'padeltop_tournament';
const HISTORY_KEY = 'padeltop_history';
const PLAYERS_KEY = 'padeltop_players';

export function saveTournament(data) {
  try { localStorage.setItem(TOURNAMENT_KEY, JSON.stringify(data)); } catch (_) {}
}

export function loadTournament() {
  try {
    const raw = localStorage.getItem(TOURNAMENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}

export function clearTournament() {
  localStorage.removeItem(TOURNAMENT_KEY);
}

export function savePlayers(players) {
  try { localStorage.setItem(PLAYERS_KEY, JSON.stringify(players)); } catch (_) {}
}

export function loadPlayers() {
  try {
    const raw = localStorage.getItem(PLAYERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) { return []; }
}

export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) { return []; }
}

export function saveTournamentToHistory(tournament) {
  const history = loadHistory();
  const existing = history.findIndex((t) => t.id === tournament.id);
  if (existing >= 0) {
    history[existing] = tournament;
  } else {
    history.unshift(tournament);
  }
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch (_) {}
}

export function deleteFromHistory(id) {
  const history = loadHistory().filter((t) => t.id !== id);
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch (_) {}
}
