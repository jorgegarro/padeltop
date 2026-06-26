import { ChevronLeft, Trophy, Trash2, Eye } from 'lucide-react';

export default function TournamentHistory({ history, onBack, onView, onDelete }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mb-4">
            <Trophy className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Tournament History</h1>
          <p className="text-slate-400 mt-1">View past tournaments</p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
          {history.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">No tournaments yet.</p>
          ) : (
            history.map((t) => {
              const totalMatches = t.rounds.reduce((a, r) => a + r.matches.length, 0);
              const playedMatches = t.rounds.reduce((a, r) => a + r.matches.filter((m) => m.played).length, 0);
              const finished = playedMatches === totalMatches;
              return (
                <div key={t.id} className="bg-slate-700 rounded-xl p-4 flex items-center gap-3">
                  <div className="flex-1">
                    <div className="font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        t.type === 'americano' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {t.type === 'americano' ? 'Americano' : 'Mexicano'}
                      </span>
                      <span>{t.players.length} players</span>
                      <span>{playedMatches}/{totalMatches} matches</span>
                      {finished && <span className="text-green-400">Complete</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => onView(t)}
                    className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete "${t.name}"?`)) onDelete(t.id);
                    }}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <button
          onClick={onBack}
          className="w-full mt-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </button>
      </div>
    </div>
  );
}
