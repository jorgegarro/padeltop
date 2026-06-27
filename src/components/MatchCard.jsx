import { useState } from 'react';
import { CheckCircle, Clock } from 'lucide-react';

export default function MatchCard({ match, players, pointsPerMatch, scoreType, gamesPerSet, numberOfSets, onSave }) {
  const isGames = scoreType === 'games';
  const [s1, setS1] = useState(match.score1 !== null ? match.score1 : '');
  const [sets, setSets] = useState(match.sets || Array.from({ length: numberOfSets || 3 }, () => ['', '']));
  const [editing, setEditing] = useState(!match.played);

  const getName = (id) => players.find((p) => p.id === id)?.name ?? id;

  const s2 = s1 !== '' ? pointsPerMatch - Number(s1) : '';

  const options = [];
  for (let i = 0; i <= pointsPerMatch; i++) options.push(i);

  const gameOptions = [0, 1, 2, 3, 4, 5, 6, 7];

  const handleSave = () => {
    if (isGames) {
      const validSets = sets.filter(([a, b]) => a !== '' && b !== '');
      if (validSets.length === 0) return;
      let w1 = 0, w2 = 0, totalG1 = 0, totalG2 = 0;
      for (const [a, b] of validSets) {
        totalG1 += Number(a);
        totalG2 += Number(b);
        if (Number(a) > Number(b)) w1++;
        else if (Number(b) > Number(a)) w2++;
      }
      onSave(match.id, totalG1, totalG2, validSets, w1 > w2 ? 1 : w2 > w1 ? 2 : 0);
    } else {
      const n1 = Number(s1);
      const n2 = pointsPerMatch - n1;
      if (s1 === '' || isNaN(n1)) return;
      onSave(match.id, n1, n2);
    }
    setEditing(false);
  };

  const updateSet = (setIdx, teamIdx, value) => {
    setSets((prev) => prev.map((s, i) => i === setIdx ? (teamIdx === 0 ? [value, s[1]] : [s[0], value]) : s));
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
        <div className="flex-1 text-right">
          {match.team1.map((id) => (
            <div key={id} className="text-sm text-white leading-tight">{getName(id)}</div>
          ))}
        </div>

        <div className="flex items-center gap-1 px-2">
          {editing ? (
            isGames ? (
              <div className="flex flex-col gap-1">
                {sets.map((setScores, si) => (
                  <div key={si} className="flex items-center gap-1">
                    <span className="text-xs text-slate-500 w-5">S{si + 1}</span>
                    <select
                      className="w-12 bg-slate-700 border border-slate-600 rounded text-center text-white py-1 text-sm focus:outline-none focus:border-green-500 appearance-none cursor-pointer"
                      value={setScores[0]}
                      onChange={(e) => updateSet(si, 0, e.target.value === '' ? '' : Number(e.target.value))}
                    >
                      <option value="">-</option>
                      {gameOptions.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <span className="text-slate-400 font-bold text-xs">-</span>
                    <select
                      className="w-12 bg-slate-700 border border-slate-600 rounded text-center text-white py-1 text-sm focus:outline-none focus:border-green-500 appearance-none cursor-pointer"
                      value={setScores[1]}
                      onChange={(e) => updateSet(si, 1, e.target.value === '' ? '' : Number(e.target.value))}
                    >
                      <option value="">-</option>
                      {gameOptions.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <select
                  className="w-14 bg-slate-700 border border-slate-600 rounded text-center text-white py-1.5 focus:outline-none focus:border-green-500 appearance-none cursor-pointer"
                  value={s1}
                  onChange={(e) => setS1(e.target.value === '' ? '' : Number(e.target.value))}
                >
                  <option value="">-</option>
                  {options.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
                <span className="text-slate-400 font-bold">-</span>
                <div className="w-14 bg-slate-700 border border-slate-600 rounded text-center text-white py-1.5 text-sm">
                  {s2 !== '' ? s2 : '-'}
                </div>
              </>
            )
          ) : (
            isGames && match.sets ? (
              <div className="flex flex-col items-center gap-0.5">
                {match.sets.map((setScores, si) => (
                  <span key={si} className="text-white font-bold text-sm px-1">
                    {setScores[0]} - {setScores[1]}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-white font-bold text-lg px-1">
                {match.score1} - {match.score2}
              </span>
            )
          )}
        </div>

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
            disabled={isGames ? sets.every(([a, b]) => a === '' || b === '') : s1 === ''}
            className="px-4 py-1.5 bg-green-500 hover:bg-green-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
          >
            Save Score
          </button>
        ) : (
          <button
            onClick={() => {
              if (isGames) {
                setSets(match.sets || Array.from({ length: numberOfSets || 3 }, () => ['', '']));
              } else {
                setS1(match.score1 !== null ? match.score1 : '');
              }
              setEditing(true);
            }}
            className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg transition-colors"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
