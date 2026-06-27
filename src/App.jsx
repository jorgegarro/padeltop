import { useState, useEffect } from 'react';
import Home from './components/Home';
import PlayersManager from './components/PlayersManager';
import Setup from './components/Setup';
import Tournament from './components/Tournament';
import TournamentHistory from './components/TournamentHistory';
import PlayerStats from './components/PlayerStats';
import { generateAmericanoRounds, generateMexicanoRound, generateFixedCouplesRounds } from './utils/tournamentEngine';
import { api } from './utils/api';
import './index.css';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [players, setPlayers] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [history, setHistory] = useState([]);
  const [viewingHistory, setViewingHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getPlayers(), api.getTournaments(), api.getActive()])
      .then(([p, h, active]) => {
        setPlayers(p);
        setHistory(h);
        if (active) {
          setTournament(active);
          setScreen('tournament');
        }
      })
      .catch((e) => console.error('Failed to load data:', e))
      .finally(() => setLoading(false));
  }, []);

  const handlePlayersUpdate = async (updated) => {
    setPlayers(updated);
    await api.syncPlayers(updated);
  };

  const handleStartTournament = async (config) => {
    const { players: tPlayers, type, courts, couples } = config;
    let rounds;
    if (type === 'americano') {
      rounds = generateAmericanoRounds(tPlayers, courts);
    } else if (type === 'couples') {
      rounds = generateFixedCouplesRounds(couples, courts);
    } else {
      const scores = {};
      for (const p of tPlayers) scores[p.id] = 0;
      rounds = [generateMexicanoRound(tPlayers, courts, 1, scores)];
    }
    const t = { ...config, id: crypto.randomUUID(), createdAt: new Date().toISOString(), rounds };
    setTournament(t);
    await api.setActive(t);
    setHistory((prev) => [t, ...prev]);
    setScreen('tournament');
  };

  const handleUpdateTournament = async (updated) => {
    setTournament(updated);
    await api.setActive(updated);
    setHistory((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleFinishTournament = async () => {
    if (tournament) {
      await api.saveTournament({ ...tournament, active: false });
      setHistory((prev) => prev.map((t) => (t.id === tournament.id ? { ...tournament, active: false } : t)));
    }
    await api.clearActive();
    setTournament(null);
    setScreen('home');
  };

  const handleViewHistorical = (t) => {
    setViewingHistory(t);
    setScreen('view-history');
  };

  const handleDeleteHistorical = async (id) => {
    await api.deleteTournament(id);
    setHistory((prev) => prev.filter((t) => t.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-400 text-sm">Loading PadelTOP...</p>
        </div>
      </div>
    );
  }

  if (screen === 'home') {
    return (
      <Home
        onNavigate={setScreen}
        historyCount={history.length}
        playerCount={players.length}
        activeTournament={tournament}
      />
    );
  }

  if (screen === 'players') {
    return (
      <PlayersManager
        players={players}
        onUpdate={handlePlayersUpdate}
        onBack={() => setScreen('home')}
      />
    );
  }

  if (screen === 'setup') {
    return (
      <Setup
        registeredPlayers={players}
        onStart={handleStartTournament}
        onBack={() => setScreen('home')}
      />
    );
  }

  if (screen === 'stats') {
    return (
      <PlayerStats
        allPlayers={players}
        allTournaments={history}
        onBack={() => setScreen('home')}
      />
    );
  }

  if (screen === 'history') {
    return (
      <TournamentHistory
        history={history}
        onBack={() => setScreen('home')}
        onView={handleViewHistorical}
        onDelete={handleDeleteHistorical}
      />
    );
  }

  if (screen === 'view-history' && viewingHistory) {
    return (
      <Tournament
        tournament={viewingHistory}
        onUpdate={async (updated) => {
          setViewingHistory(updated);
          await api.saveTournament(updated);
          setHistory((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        }}
        onFinish={() => {
          setViewingHistory(null);
          setScreen('history');
        }}
        onHome={() => {
          setViewingHistory(null);
          setScreen('home');
        }}
      />
    );
  }

  if (screen === 'tournament' && tournament) {
    return (
      <Tournament
        tournament={tournament}
        onUpdate={handleUpdateTournament}
        onFinish={handleFinishTournament}
        onHome={() => setScreen('home')}
      />
    );
  }

  return <Home onNavigate={setScreen} historyCount={history.length} playerCount={players.length} activeTournament={tournament} />;
}
