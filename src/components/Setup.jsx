import { useState } from 'react';
import { Trophy, Layout, Target, ChevronRight, ChevronLeft, Check } from 'lucide-react';

export default function Setup({ registeredPlayers, onStart, onBack }) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    name: '',
    courts: 2,
    pointsPerMatch: 32,
    type: 'americano',
    rounds: 4,
  });
  const [selected, setSelected] = useState(new Set());

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === registeredPlayers.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(registeredPlayers.map((p) => p.id)));
    }
  };

  const selectedPlayers = registeredPlayers.filter((p) => selected.has(p.id));
  const canProceed = selectedPlayers.length >= 4 && selectedPlayers.length % 4 === 0;

  const handleStart = () => {
    onStart({ ...config, players: selectedPlayers });
  };

  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
              <Trophy className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">New Tournament</h1>
            <p className="text-slate-400 mt-1">Configure your tournament</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
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
                  <Layout className="inline w-4 h-4 mr-1" />Courts
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
                  <Target className="inline w-4 h-4 mr-1" />Points/Match
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

            <div className="flex gap-3">
              <button
                onClick={onBack}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                disabled={!config.name}
                onClick={() => setStep(2)}
                className="flex-1 py-3 bg-green-500 hover:bg-green-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                Select Players <ChevronRight className="w-4 h-4" />
              </button>
            </div>
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
            <Trophy className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Select Players</h1>
          <p className="text-slate-400 mt-1">Pick players for this tournament (multiples of 4)</p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          {registeredPlayers.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-4">
              No players registered. Go back and add players first.
            </p>
          ) : (
            <>
              <button
                onClick={selectAll}
                className="text-sm text-green-400 hover:text-green-300 transition-colors"
              >
                {selected.size === registeredPlayers.length ? 'Deselect All' : 'Select All'}
              </button>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {registeredPlayers.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => toggle(p.id)}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-all ${
                      selected.has(p.id)
                        ? 'bg-green-500/15 border border-green-500/40'
                        : 'bg-slate-700 border border-transparent hover:border-slate-500'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      selected.has(p.id) ? 'bg-green-500 border-green-500' : 'border-slate-500'
                    }`}>
                      {selected.has(p.id) && <Check className="w-3 h-3 text-white" />}
                    </span>
                    <span className="flex-1 text-white">{p.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="text-sm text-slate-400">
            {selected.size} selected
            {selected.size >= 4 && selected.size % 4 !== 0 && (
              <span className="text-yellow-400 ml-2">
                (need {4 - (selected.size % 4)} more for full courts)
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
