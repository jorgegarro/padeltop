const API_URL = import.meta.env.VITE_API_URL || 'https://padeltop-api.onrender.com';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getPlayers: () => request('/api/players'),
  syncPlayers: (players) => request('/api/players/sync', { method: 'PUT', body: JSON.stringify(players) }),
  deletePlayer: (id) => request(`/api/players/${id}`, { method: 'DELETE' }),

  getTournaments: () => request('/api/tournaments'),
  saveTournament: (t) => request(`/api/tournaments/${t.id}`, { method: 'PUT', body: JSON.stringify(t) }),
  deleteTournament: (id) => request(`/api/tournaments/${id}`, { method: 'DELETE' }),

  getActive: () => request('/api/active'),
  setActive: (t) => request(`/api/active/${t.id}`, { method: 'PUT', body: JSON.stringify(t) }),
  clearActive: () => request('/api/active', { method: 'DELETE' }),
};
