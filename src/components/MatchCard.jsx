import { useState } from 'react';
import { CheckCircle, Clock } from 'lucide-react';

export default function MatchCard({ match, players, pointsPerMatch, onSave }) {
  const [s1, setS1] = useState(match.score1 !== null ? String(match.score1) : '');
  const [s2, setS2] = useState(match.score2 !== null ? String(match.score2) : '');
  const [editing, setEditing] = useState(!match.played);

  const getName = (id) => players.find((p) => p.id === id)?.name ?? id;

  const handleSave = () => {
    const n1 = Number(s1);
    const n2 = Number(s2);
    if (isNaN(n1) || isNaN(n2)) return;
    if (n1 + n2 !== pointsPerMatch) {
      alert(`Scores must add up to ${pointsPerMatch}`);
      return;
    }
    onSave(match.id, n1, n2);
    setEditing(false);
  };

  return (
    <div className={`bg-slate-800 rounded-xl p-4 border ${match.played ? 'border-green-500/30' : 'border-slate-700'}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
          Court {match.court}
        </span>
        {match.played ? (
          <CheckCircle className="w-4 h-4 text-green-400" />
        ) : (
          <Clock className="w-4 h-4 text-slate-500" />
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Team 1 */}
        <div className="flex-1 text-right">
          {match.team1.map((id) => (
            <div key={id} className="text-sm text-white leading-tight">{getName(id)}</div>
          ))}
        </div>

        {/* Score */}
        <div className="flex items-center gap-1 px-2">
          {editing ? (
            <>
              <input
                type="number" min="0" max={pointsPerMatch}
                className="w-10 bg-slate-700 border border-slate-600 rounded text-center text-white py-1 focus:outline-none focus:border-green-500"
                value={s1}
                onChange={(e) => setS1(e.target.value)}
              />
              <span className="text-slate-400">-</span>
              <input
                type="number" min="0" max={pointsPerMatch}
                className="w-10 bg-slate-700 border border-slate-600 rounded text-center text-white py-1 focus:outline-none focus:border-green-500"
                value={s2}
                onChange={(e) => setS2(e.target.value)}
              />
            </>
          ) : (
            <span className="text-white font-bold text-lg px-1">
              {match.score1} - {match.score2}
            </span>
          )}
        </div>

        {/* Team 2 */}
        <div className="flex-1">
          {match.team2.map((id) => (
            <div key={id} className="text-sm text-white leading-tight">{getName(id)}</div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex justify-center gap-2">
        {editing ? (
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-green-500 hover:bg-green-400 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Save Score
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg transition-colors"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
