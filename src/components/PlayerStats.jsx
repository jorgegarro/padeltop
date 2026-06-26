import { useState } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp, BarChart3, Trophy, Users, Swords, TrendingUp, TrendingDown } from 'lucide-react';

function aggregatePlayerData(playerId, allTournaments, allPlayers) {
  const getName = (id) => allPlayers.find((p) => p.id === id)?.name ?? 'Unknown';

  const matches = [];
  const partnerStats = {};
  const opponentStats = {};
  let totalWins = 0, totalTies = 0, totalLosses = 0, totalPoints = 0;

  for (const t of allTournaments) {
    for (const round of t.rounds) {
      for (const m of round.matches) {
        if (!m.played) continue;
        const inTeam1 = m.team1.includes(playerId);
        const inTeam2 = m.team2.includes(playerId);
        if (!inTeam1 && !inTeam2) continue;

        const myScore = Number(inTeam1 ? m.score1 : m.score2);
        const oppScore = Number(inTeam1 ? m.score2 : m.score1);
        const myTeam = inTeam1 ? m.team1 : m.team2;
        const oppTeam = inTeam1 ? m.team2 : m.team1;
        const partners = myTeam.filter((id) => id !== playerId);
        const result = myScore > oppScore ? 'W' : myScore < oppScore ? 'L' : 'T';

        totalPoints += myScore;
        if (result === 'W') totalWins++;
        else if (result === 'T') totalTies++;
        else totalLosses++;

        matches.push({
          tournament: t.name,
          round: round.round,
          court: m.court,
          myScore,
          oppScore,
          partners,
          opponents: oppTeam,
          result,
        });

        for (const pid of partners) {
          if (!partnerStats[pid]) partnerStats[pid] = { wins: 0, ties: 0, losses: 0, played: 0 };
          partnerStats[pid].played++;
          if (result === 'W') partnerStats[pid].wins++;
          else if (result === 'T') partnerStats[pid].ties++;
          else partnerStats[pid].losses++;
        }

        for (const pid of oppTeam) {
          if (!opponentStats[pid]) opponentStats[pid] = { wins: 0, ties: 0, losses: 0, played: 0 };
          opponentStats[pid].played++;
          if (result === 'W') opponentStats[pid].wins++;
          else if (result === 'T') opponentStats[pid].ties++;
          else opponentStats[pid].losses++;
        }
      }
    }
  }

  const partnerList = Object.entries(partnerStats)
    .map(([id, s]) => ({ id, name: getName(id), ...s }))
    .sort((a, b) => b.played - a.played);

  const opponentList = Object.entries(opponentStats)
    .map(([id, s]) => ({ id, name: getName(id), ...s }))
    .sort((a, b) => b.played - a.played);

  const bestPartner = [...partnerList].sort((a, b) => b.wins - a.wins || a.losses - b.losses)[0];
  const worstPartner = [...partnerList].sort((a, b) => b.losses - a.losses || a.wins - b.wins)[0];
  const bestAgainst = [...opponentList].sort((a, b) => b.wins - a.wins || a.losses - b.losses)[0];
  const worstAgainst = [...opponentList].sort((a, b) => b.losses - a.losses || a.wins - b.wins)[0];

  return {
    matches, totalWins, totalTies, totalLosses, totalPoints,
    partnerList, opponentList,
    bestPartner, worstPartner, bestAgainst, worstAgainst,
  };
}

function StatCard({ icon, label, value, sublabel, color }) {
  return (
    <div className="bg-slate-700 rounded-xl p-3 text-center">
      <div className={`flex items-center justify-center gap-1 text-xs ${color} mb-1`}>
        {icon} {label}
      </div>
      <div className="text-white font-bold text-lg">{value}</div>
      {sublabel && <div className="text-slate-500 text-xs">{sublabel}</div>}
    </div>
  );
}

function HighlightCard({ icon, label, player, stat, color, bgColor }) {
  if (!player) return null;
  return (
    <div className={`${bgColor} rounded-xl p-3 flex items-center gap-3`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-xs text-slate-400">{label}</div>
        <div className="text-white font-semibold">{player.name}</div>
      </div>
      <div className="text-right text-xs">
        <span className="text-green-400">{player.wins}W</span>
        {' · '}
        <span className="text-red-400">{player.losses}L</span>
        {' · '}
        <span className="text-slate-400">{player.played}P</span>
      </div>
    </div>
  );
}

function RelationshipTable({ title, icon, list }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? list : list.slice(0, 5);
  return (
    <div className="bg-slate-800 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700 flex items-center gap-2">
        {icon}
        <span className="font-semibold text-white text-sm">{title}</span>
      </div>
      <div className="divide-y divide-slate-700">
        {shown.map((p) => (
          <div key={p.id} className="flex items-center px-4 py-2">
            <div className="flex-1 text-sm text-white">{p.name}</div>
            <div className="flex gap-3 text-xs">
              <span className="text-green-400">{p.wins}W</span>
              <span className="text-yellow-400">{p.ties}T</span>
              <span className="text-red-400">{p.losses}L</span>
              <span className="text-slate-500">{p.played}P</span>
            </div>
          </div>
        ))}
      </div>
      {list.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1"
        >
          {expanded ? <>Show less <ChevronUp className="w-3 h-3" /></> : <>Show all ({list.length}) <ChevronDown className="w-3 h-3" /></>}
        </button>
      )}
    </div>
  );
}

function MatchHistoryTable({ matches, allPlayers }) {
  const [expanded, setExpanded] = useState(false);
  const getName = (id) => allPlayers.find((p) => p.id === id)?.name ?? 'Unknown';
  const shown = expanded ? matches : matches.slice(0, 5);

  return (
    <div className="bg-slate-800 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-slate-400" />
        <span className="font-semibold text-white text-sm">All Matches ({matches.length})</span>
      </div>
      <div className="divide-y divide-slate-700">
        {shown.map((m, i) => (
          <div key={i} className={`px-4 py-2 border-l-3 ${
            m.result === 'W' ? 'border-green-500' : m.result === 'T' ? 'border-yellow-500' : 'border-red-500'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">{m.tournament} · R{m.round}</span>
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                m.result === 'W' ? 'bg-green-500/20 text-green-400' :
                m.result === 'T' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {m.result === 'W' ? 'WIN' : m.result === 'T' ? 'TIE' : 'LOSS'}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-white">w/ {m.partners.map(getName).join(', ')}</span>
              <span className="text-sm font-bold text-white">{m.myScore} - {m.oppScore}</span>
            </div>
            <div className="text-xs text-slate-400">vs {m.opponents.map(getName).join(' & ')}</div>
          </div>
        ))}
      </div>
      {matches.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1"
        >
          {expanded ? <>Show less <ChevronUp className="w-3 h-3" /></> : <>Show all ({matches.length}) <ChevronDown className="w-3 h-3" /></>}
        </button>
      )}
    </div>
  );
}

export default function PlayerStats({ allPlayers, allTournaments, onBack }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const playersWithMatches = allPlayers.filter((p) =>
    allTournaments.some((t) =>
      t.rounds.some((r) =>
        r.matches.some((m) => m.played && (m.team1.includes(p.id) || m.team2.includes(p.id)))
      )
    )
  );

  if (selectedPlayer) {
    const data = aggregatePlayerData(selectedPlayer.id, allTournaments, allPlayers);
    const totalPlayed = data.totalWins + data.totalTies + data.totalLosses;
    const winRate = totalPlayed > 0 ? Math.round((data.totalWins / totalPlayed) * 100) : 0;

    return (
      <div className="min-h-screen p-4 max-w-2xl mx-auto">
        <button
          onClick={() => setSelectedPlayer(null)}
          className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors mb-4 text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> All Players
        </button>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">{selectedPlayer.name}</h1>
          <p className="text-slate-400 text-sm mt-1">{totalPlayed} matches across {allTournaments.filter((t) => t.players.some((p) => p.id === selectedPlayer.id)).length} tournaments</p>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-6">
          <StatCard label="Wins" value={data.totalWins} color="text-green-400" icon={<Trophy className="w-3 h-3" />} />
          <StatCard label="Ties" value={data.totalTies} color="text-yellow-400" icon={<Swords className="w-3 h-3" />} />
          <StatCard label="Losses" value={data.totalLosses} color="text-red-400" icon={<TrendingDown className="w-3 h-3" />} />
          <StatCard label="Win %" value={`${winRate}%`} color="text-blue-400" icon={<TrendingUp className="w-3 h-3" />} />
        </div>

        <div className="space-y-3 mb-6">
          <HighlightCard
            icon={<TrendingUp className="w-4 h-4" />}
            label="Best partner (most wins)"
            player={data.bestPartner}
            color="text-green-400"
            bgColor="bg-green-500/5"
          />
          <HighlightCard
            icon={<TrendingDown className="w-4 h-4" />}
            label="Toughest partner (most losses)"
            player={data.worstPartner}
            color="text-red-400"
            bgColor="bg-red-500/5"
          />
          <HighlightCard
            icon={<Trophy className="w-4 h-4" />}
            label="Easiest opponent (most wins against)"
            player={data.bestAgainst}
            color="text-green-400"
            bgColor="bg-green-500/5"
          />
          <HighlightCard
            icon={<Swords className="w-4 h-4" />}
            label="Toughest opponent (most losses against)"
            player={data.worstAgainst}
            color="text-red-400"
            bgColor="bg-red-500/5"
          />
        </div>

        <div className="space-y-4">
          <RelationshipTable
            title="Partner History"
            icon={<Users className="w-5 h-5 text-blue-400" />}
            list={data.partnerList}
          />
          <RelationshipTable
            title="Opponent History"
            icon={<Swords className="w-5 h-5 text-orange-400" />}
            list={data.opponentList}
          />
          <MatchHistoryTable matches={data.matches} allPlayers={allPlayers} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20 mb-4">
            <BarChart3 className="w-8 h-8 text-orange-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Player Stats</h1>
          <p className="text-slate-400 mt-1">All-time stats across tournaments</p>
        </div>

        <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {playersWithMatches.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No match data yet. Play some tournaments first!</p>
          ) : (
            <div className="divide-y divide-slate-700">
              {playersWithMatches.map((p) => {
                const data = aggregatePlayerData(p.id, allTournaments, allPlayers);
                const total = data.totalWins + data.totalTies + data.totalLosses;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlayer(p)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-750 transition-colors text-left"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-white">{p.name}</div>
                      <div className="text-xs text-slate-500">{total} matches</div>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="text-green-400">{data.totalWins}W</span>
                      <span className="text-yellow-400">{data.totalTies}T</span>
                      <span className="text-red-400">{data.totalLosses}L</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-500 -rotate-90" />
                  </button>
                );
              })}
            </div>
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
