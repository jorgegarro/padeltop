import { useState, useEffect } from 'react';
import Setup from './components/Setup';
import Tournament from './components/Tournament';
import { generateAmericanoRounds, generateMexicanoRound } from './utils/tournamentEngine';
import { saveTournament, loadTournament, clearTournament } from './utils/storage';
import './index.css';

export default function App() {
  const [tournament, setTournament] = useState(() => loadTournament());

  useEffect(() => {
    if (tournament) saveTournament(tournament);
  }, [tournament]);

  const handleStart = (config) => {
    const { players, type, courts } = config;
    let rounds;
    if (type === 'americano') {
      rounds = generateAmericanoRounds(players, courts);
    } else {
      const scores = {};
      for (const p of players) scores[p.id] = 0;
      rounds = [generateMexicanoRound(players, courts, 1, scores)];
    }
    setTournament({ ...config, rounds });
  };

  const handleUpdate = (updated) => setTournament(updated);

  const handleReset = () => {
    if (!window.confirm('Start a new tournament? Current data will be lost.')) return;
    clearTournament();
    setTournament(null);
  };

  if (!tournament) return <Setup onStart={handleStart} />;

  return (
    <Tournament
      tournament={tournament}
      onUpdate={handleUpdate}
      onReset={handleReset}
    />
  );
}
