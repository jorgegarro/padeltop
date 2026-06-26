import { useState } from 'react';
import { ChevronDown, ChevronUp, User } from 'lucide-react';

export default function PlayerHistory({ players, rounds }) {
  const [expandedPlayer, setExpandedPlayer] = useState(null);

  const getName = (id) => players.find((p) => p.id === id)?.name ?? id;

  const getPlayerMatches = (playerId) => {
    const matches = [];
    for (const round of rounds) {
      for (const m of round.matches) {
        if (!m.played) continue;
        const inTeam1 = m.team1.includes(playerId);
        const inTeam2 = m.team2.includes(playerId);
        if (!inTeam1 && !inTeam2) continue;
        const myScore = inTeam1 ? Number(m.score1) : Number(m.score2);
        const oppScore = inTeam1 ? Number(m.score2) : Number(m.score1);
        const partner = (inTeam1 ? m.team1 : m.team2).filter((id) => id !== playerId);
        const opponents = inTeam1 ? m.team2 : m.team1;
        const result = myScore > oppScore ? 'W' : myScore < oppScore ? 'L' : 'T';
        matches.push({ round: round.round, court: m.court, myScore, oppScore, partner, opponents, result });
      }
    }
    return matches;
  };

  return (
    <div className="bg-slate-800 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700 flex items-center gap-2">
        <User className="w-5 h-5 text-blue-400" />
        <span className="font-semibold text-white">Player Match History</span>
      </div>
      <div className="divide-y divide-slate-700">
        {players.map((p) => {
          const matches = getPlayerMatches(p.id);
          const open = expandedPlayer === p.id;
          const wins = matches.filter((m) => m.result === 'W').length;
          const ties = matches.filter((m) => m.result === 'T').length;
          const losses = matches.filter((m) => m.result === 'L').length;
          return (
            <div key={p.id}>
              <button
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-750 transition-colors"
                onClick={() => setExpandedPlayer(open ? null : p.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{p.name}</span>
                  <span className="text-xs text-slate-500">{matches.length} matches</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-green-400">{wins}W</span>
                  <span className="text-xs text-yellow-400">{ties}T</span>
                  <span className="text-xs text-red-400">{losses}L</span>
                  {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </button>
              {open && (
                <div className="px-4 pb-3 space-y-2">
                  {matches.length === 0 && (
                    <p className="text-slate-500 text-sm text-center py-2">No matches played yet</p>
                  )}
                  {matches.map((m, i) => (
                    <div key={i} className={`bg-slate-700 rounded-lg px-3 py-2 border-l-3 ${
                      m.result === 'W' ? 'border-green-500' : m.result === 'T' ? 'border-yellow-500' : 'border-red-500'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-500">Round {m.round} · Court {m.court}</div>
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                          m.result === 'W' ? 'bg-green-500/20 text-green-400' :
                          m.result === 'T' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {m.result === 'W' ? 'WIN' : m.result === 'T' ? 'TIE' : 'LOSS'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-sm text-white">
                          w/ {m.partner.map(getName).join(', ')}
                        </div>
                        <div className="text-sm font-bold text-white">{m.myScore} - {m.oppScore}</div>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        vs {m.opponents.map(getName).join(' & ')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
