import { useState } from 'react';
import { Users, Plus, X, ChevronLeft } from 'lucide-react';

export default function PlayersManager({ players, onUpdate, onBack }) {
  const [newPlayer, setNewPlayer] = useState('');

  const addPlayer = () => {
    const name = newPlayer.trim();
    if (!name) return;
    if (players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      alert('Player already exists');
      return;
    }
    onUpdate([...players, { id: crypto.randomUUID(), name }]);
    setNewPlayer('');
  };

  const removePlayer = (id) => {
    onUpdate(players.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-4">
            <Users className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Players</h1>
          <p className="text-slate-400 mt-1">Manage your player roster</p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex gap-2">
            <input
              className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="Player name"
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
            />
            <button
              onClick={addPlayer}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {players.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-4">No players yet. Add some!</p>
            )}
            {players.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 bg-slate-700 rounded-lg px-3 py-2">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-bold">
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
            {players.length} player{players.length !== 1 ? 's' : ''} registered
          </div>

          <button
            onClick={onBack}
            className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
