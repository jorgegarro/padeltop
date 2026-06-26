import { useState } from 'react';
import { Trophy, Calendar, Home, Users } from 'lucide-react';
import Schedule from './Schedule';
import Leaderboard from './Leaderboard';
import { generateMexicanoRound, getScoresMap } from '../utils/tournamentEngine';

const TABS = ['Leaderboard', 'Schedule'];

export default function Tournament({ tournament, onUpdate, onFinish, onHome }) {
  const [tab, setTab] = useState('Leaderboard');
  const { name, type, players, rounds, courts, pointsPerMatch } = tournament;

  const handleScoreUpdate = (roundNum, matchId, s1, s2) => {
    const newRounds = rounds.map((r) => {
      if (r.round !== roundNum) return r;
      return {
        ...r,
        matches: r.matches.map((m) =>
          m.id === matchId ? { ...m, score1: s1, score2: s2, played: true } : m
        ),
      };
    });
    onUpdate({ ...tournament, rounds: newRounds });
  };

  const handleAddMexicanoRound = () => {
    const scores = getScoresMap(players, rounds);
    const nextRound = generateMexicanoRound(players, courts, rounds.length + 1, scores);
    onUpdate({ ...tournament, rounds: [...rounds, nextRound] });
  };

  const lastRound = rounds[rounds.length - 1];
  const allRoundsPlayed = lastRound?.matches.every((m) => m.played) ?? false;

  const totalPlayed = rounds.reduce((a, r) => a + r.matches.filter((m) => m.played).length, 0);
  const totalMatches = rounds.reduce((a, r) => a + r.matches.length, 0);

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              type === 'americano' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
            }`}>
              {type === 'americano' ? 'Americano' : 'Mexicano'}
            </span>
            <span className="text-slate-500 text-xs">
              <Users className="inline w-3 h-3 mr-1" />{players.length} players
            </span>
            <span className="text-slate-500 text-xs">
              {totalPlayed}/{totalMatches} matches
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onHome}
            className="p-2 text-slate-500 hover:text-green-400 transition-colors"
            title="Home"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex bg-slate-800 rounded-xl p-1 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              tab === t ? 'bg-green-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t === 'Leaderboard' ? <Trophy className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
            {t}
          </button>
        ))}
      </div>

      {tab === 'Leaderboard' && <Leaderboard players={players} rounds={rounds} />}

      {tab === 'Schedule' && (
        <Schedule
          rounds={rounds}
          players={players}
          pointsPerMatch={pointsPerMatch}
          onScoreUpdate={handleScoreUpdate}
          onAddMexicanoRound={handleAddMexicanoRound}
          isMexicano={type === 'mexicano'}
          allRoundsPlayed={allRoundsPlayed}
        />
      )}
    </div>
  );
}
