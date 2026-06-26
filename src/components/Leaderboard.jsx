import { Trophy, Medal } from 'lucide-react';
import { computeLeaderboard } from '../utils/tournamentEngine';

export default function Leaderboard({ players, rounds }) {
  const board = computeLeaderboard(players, rounds);

  const medal = (i) => {
    if (i === 0) return <Trophy className="w-4 h-4 text-yellow-400" />;
    if (i === 1) return <Medal className="w-4 h-4 text-slate-300" />;
    if (i === 2) return <Medal className="w-4 h-4 text-amber-600" />;
    return <span className="w-4 h-4 text-slate-500 text-sm flex items-center justify-center">{i + 1}</span>;
  };

  return (
    <div className="bg-slate-800 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className="font-semibold text-white">Leaderboard</span>
        </div>
        <div className="flex gap-3 text-xs text-slate-500 font-medium">
          <span className="w-8 text-center">W</span>
          <span className="w-8 text-center">T</span>
          <span className="w-8 text-center">Pts</span>
          <span className="w-8 text-center">P</span>
        </div>
      </div>
      <div className="divide-y divide-slate-700">
        {board.map((p, i) => (
          <div
            key={p.id}
            className={`flex items-center gap-3 px-4 py-3 ${i === 0 ? 'bg-yellow-500/5' : ''}`}
          >
            <div className="flex items-center justify-center w-6">{medal(i)}</div>
            <div className="flex-1 font-medium text-white truncate">{p.name}</div>
            <div className="flex gap-3 text-sm">
              <span className="w-8 text-center text-green-400 font-bold">{p.wins}</span>
              <span className="w-8 text-center text-yellow-400 font-bold">{p.ties}</span>
              <span className="w-8 text-center text-blue-400 font-bold">{p.score}</span>
              <span className="w-8 text-center text-slate-400">{p.played}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
