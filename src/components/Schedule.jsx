import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import MatchCard from './MatchCard';

export default function Schedule({ rounds, players, pointsPerMatch, onScoreUpdate, onAddMexicanoRound, isMexicano, allRoundsPlayed }) {
  const [openRound, setOpenRound] = useState(rounds.length);

  return (
    <div className="space-y-3">
      {rounds.map((r) => {
        const played = r.matches.filter((m) => m.played).length;
        const total = r.matches.length;
        const open = openRound === r.round;
        return (
          <div key={r.round} className="bg-slate-800 rounded-2xl overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-750 transition-colors"
              onClick={() => setOpenRound(open ? null : r.round)}
            >
              <span className="font-semibold text-white">Round {r.round}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">{played}/{total} played</span>
                {played === total ? (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Done</span>
                ) : (
                  <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">In progress</span>
                )}
                {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </div>
            </button>
            {open && (
              <div className="px-4 pb-4 grid gap-3 sm:grid-cols-2">
                {r.matches.map((m) => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    players={players}
                    pointsPerMatch={pointsPerMatch}
                    onSave={(id, s1, s2) => onScoreUpdate(r.round, id, s1, s2)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {isMexicano && allRoundsPlayed && (
        <button
          onClick={onAddMexicanoRound}
          className="w-full py-3 border-2 border-dashed border-green-500/40 hover:border-green-500 text-green-400 hover:text-green-300 rounded-2xl font-semibold transition-colors"
        >
          + Add Next Round
        </button>
      )}
    </div>
  );
}
