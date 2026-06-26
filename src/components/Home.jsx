import { Trophy, Users, History, Plus, Play } from 'lucide-react';

export default function Home({ onNavigate, historyCount, playerCount, activeTournament }) {
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

        <div className="space-y-3">
          {activeTournament && (
            <button
              onClick={() => onNavigate('tournament')}
              className="w-full bg-yellow-500/10 hover:bg-yellow-500/15 border border-yellow-500/30 hover:border-yellow-500/60 rounded-2xl p-5 text-left transition-all group animate-pulse-subtle"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                  <Play className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">Resume Tournament</div>
                  <div className="text-sm text-yellow-400/80">{activeTournament.name}</div>
                </div>
              </div>
            </button>
          )}

          <button
            onClick={() => onNavigate('players')}
            className="w-full bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-blue-500/50 rounded-2xl p-5 text-left transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center group-hover:bg-blue-500/25 transition-colors">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">Players</div>
                <div className="text-sm text-slate-400">{playerCount} registered</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('setup')}
            disabled={playerCount < 4}
            className="w-full bg-green-500/10 hover:bg-green-500/15 border border-green-500/30 hover:border-green-500/60 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl p-5 text-left transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                <Plus className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">New Tournament</div>
                <div className="text-sm text-slate-400">
                  {playerCount < 4 ? 'Need at least 4 players' : 'Create and start a tournament'}
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('history')}
            disabled={historyCount === 0}
            className="w-full bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-purple-500/50 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl p-5 text-left transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center group-hover:bg-purple-500/25 transition-colors">
                <History className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">Tournament History</div>
                <div className="text-sm text-slate-400">{historyCount} tournament{historyCount !== 1 ? 's' : ''}</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
