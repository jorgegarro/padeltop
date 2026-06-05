import { useState } from 'react';
import { Trophy, Users, Layout, Target, ChevronRight, Plus, X } from 'lucide-react';

export default function Setup({ onStart }) {
  const [step, setStep] = useState(1); // 1=config, 2=players
  const [config, setConfig] = useState({
    name: '',
    courts: 2,
    pointsPerMatch: 32,
    type: 'americano',
    rounds: 4,
  });
  const [players, setPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState('');

  const addPlayer = () => {
    const name = newPlayer.trim();
    if (!name) return;
    setPlayers((prev) => [...prev, { id: crypto.randomUUID(), name }]);
    setNewPlayer('');
  };

  const removePlayer = (id) => setPlayers((prev) => prev.filter((p) => p.id !== id));

  const minPlayers = 4;
  const canProceed = players.length >= minPlayers && players.length % 4 === 0;

  const handleStart = () => {
    onStart({ ...config, players });
  };

  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
              <Trophy className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">PadelTOP</h1>
            <p className="text-slate-400 mt-1">Tournament Manager</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" /> Tournament Setup
            </h2>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Tournament Name</label>
              <input
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                placeholder="e.g. Summer Padel Cup"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  <Layout className="inline w-4 h-4 mr-1" />Courts Available
                </label>
                <input
                  type="number" min="1" max="10"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                  value={config.courts}
                  onChange={(e) => setConfig({ ...config, courts: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  <Target className="inline w-4 h-4 mr-1" />Points per Match
                </label>
                <input
                  type="number" min="1" max="100"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                  value={config.pointsPerMatch}
                  onChange={(e) => setConfig({ ...config, pointsPerMatch: Number(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Tournament Type</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'americano', label: 'Americano', desc: 'Fixed partner rotation' },
                  { value: 'mexicano', label: 'Mexicano', desc: 'Dynamic ranking pairing' },
                ].map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setConfig({ ...config, type: t.value })}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      config.type === t.value
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <div className="font-semibold text-white">{t.label}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {config.type === 'mexicano' && (
              <div>
                <label className="block text-sm text-slate-400 mb-1">Number of Rounds</label>
                <input
                  type="number" min="1" max="20"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                  value={config.rounds}
                  onChange={(e) => setConfig({ ...config, rounds: Number(e.target.value) })}
                />
              </div>
            )}

            <button
              disabled={!config.name}
              onClick={() => setStep(2)}
              className="w-full py-3 bg-green-500 hover:bg-green-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              Next: Add Players <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
            <Users className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Add Players</h1>
          <p className="text-slate-400 mt-1">Minimum 4, in multiples of 4</p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex gap-2">
            <input
              className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
              placeholder="Player name"
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
            />
            <button
              onClick={addPlayer}
              className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {players.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-4">No players yet…</p>
            )}
            {players.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 bg-slate-700 rounded-lg px-3 py-2">
                <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 text-xs flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                <span className="flex-1 text-white">{p.name}</span>
                <button onClick={() => removePlayer(p.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="text-sm text-slate-400">
            {players.length} player{players.length !== 1 ? 's' : ''} added
            {players.length >= 4 && players.length % 4 !== 0 && (
              <span className="text-yellow-400 ml-2">
                (need {4 - (players.length % 4)} more for full courts)
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors"
            >
              Back
            </button>
            <button
              disabled={!canProceed}
              onClick={handleStart}
              className="flex-1 py-3 bg-green-500 hover:bg-green-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              Start Tournament <Trophy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
