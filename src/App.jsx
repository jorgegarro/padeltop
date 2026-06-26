import { useState, useEffect } from 'react';
import Home from './components/Home';
import PlayersManager from './components/PlayersManager';
import Setup from './components/Setup';
import Tournament from './components/Tournament';
import TournamentHistory from './components/TournamentHistory';
import { generateAmericanoRounds, generateMexicanoRound } from './utils/tournamentEngine';
import {
  saveTournament, loadTournament, clearTournament,
  savePlayers, loadPlayers,
  loadHistory, saveTournamentToHistory, deleteFromHistory,
} from './utils/storage';
import './index.css';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [players, setPlayers] = useState(() => loadPlayers());
  const [tournament, setTournament] = useState(() => loadTournament());
  const [history, setHistory] = useState(() => loadHistory());
  const [viewingHistory, setViewingHistory] = useState(null);

  useEffect(() => { savePlayers(players); }, [players]);
  useEffect(() => { if (tournament) saveTournament(tournament); }, [tournament]);

  // Resume active tournament on load
  useEffect(() => {
    if (tournament) setScreen('tournament');
  }, []);

  const handleStartTournament = (config) => {
    const { players: tPlayers, type, courts } = config;
    let rounds;
    if (type === 'americano') {
      rounds = generateAmericanoRounds(tPlayers, courts);
    } else {
      const scores = {};
      for (const p of tPlayers) scores[p.id] = 0;
      rounds = [generateMexicanoRound(tPlayers, courts, 1, scores)];
    }
    const t = { ...config, id: crypto.randomUUID(), createdAt: new Date().toISOString(), rounds };
    setTournament(t);
    saveTournamentToHistory(t);
    setHistory(loadHistory());
    setScreen('tournament');
  };

  const handleUpdateTournament = (updated) => {
    setTournament(updated);
    saveTournamentToHistory(updated);
    setHistory(loadHistory());
  };

  const handleFinishTournament = () => {
    if (tournament) {
      saveTournamentToHistory(tournament);
      setHistory(loadHistory());
    }
    clearTournament();
    setTournament(null);
    setScreen('home');
  };

  const handleViewHistorical = (t) => {
    setViewingHistory(t);
    setScreen('view-history');
  };

  const handleResumeHistorical = (t) => {
    setTournament(t);
    saveTournament(t);
    setViewingHistory(null);
    setScreen('tournament');
  };

  const handleDeleteHistorical = (id) => {
    deleteFromHistory(id);
    setHistory(loadHistory());
  };

  if (screen === 'home') {
    return (
      <Home
        onNavigate={setScreen}
        historyCount={history.length}
        playerCount={players.length}
      />
    );
  }

  if (screen === 'players') {
    return (
      <PlayersManager
        players={players}
        onUpdate={setPlayers}
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
        onUpdate={(updated) => {
          setViewingHistory(updated);
          saveTournamentToHistory(updated);
          setHistory(loadHistory());
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

  return <Home onNavigate={setScreen} historyCount={history.length} playerCount={players.length} />;
}
