export function generateAmericanoRounds(players, courts) {
  const rounds = [];
  const ids = players.map((p) => p.id);
  let arr = [...ids];
  const totalRounds = ids.length - 1;

  for (let r = 0; r < totalRounds; r++) {
    const matches = [];
    const pairs = [];
    for (let i = 0; i < Math.floor(arr.length / 2); i++) {
      pairs.push([arr[i], arr[arr.length - 1 - i]]);
    }
    for (let i = 0; i < pairs.length - 1; i += 2) {
      const courtIndex = Math.floor(i / 2) % courts;
      matches.push({
        id: `r${r}m${i / 2}`,
        team1: pairs[i],
        team2: pairs[i + 1],
        court: courtIndex + 1,
        score1: null,
        score2: null,
        played: false,
      });
    }
    if (matches.length > 0) rounds.push({ round: r + 1, matches });
    arr = [arr[0], arr[arr.length - 1], ...arr.slice(1, arr.length - 1)];
  }
  return rounds;
}

export function generateMexicanoRound(players, courts, roundNumber, scores) {
  const ranked = [...players].sort(
    (a, b) => (scores[b.id] || 0) - (scores[a.id] || 0)
  );
  const matches = [];
  for (let i = 0; i < ranked.length - 3; i += 4) {
    const courtIndex = Math.floor(i / 4) % courts;
    matches.push({
      id: `r${roundNumber}m${i / 4}`,
      team1: [ranked[i].id, ranked[i + 3].id],
      team2: [ranked[i + 1].id, ranked[i + 2].id],
      court: courtIndex + 1,
      score1: null,
      score2: null,
      played: false,
    });
  }
  return { round: roundNumber, matches };
}

export function computeLeaderboard(players, rounds) {
  const scores = {};
  const wins = {};
  const ties = {};
  const played = {};
  for (const p of players) {
    scores[p.id] = 0;
    wins[p.id] = 0;
    ties[p.id] = 0;
    played[p.id] = 0;
  }

  for (const round of rounds) {
    for (const m of round.matches) {
      if (!m.played) continue;
      const s1 = Number(m.score1);
      const s2 = Number(m.score2);
      for (const pid of m.team1) {
        scores[pid] = (scores[pid] || 0) + s1;
        played[pid] = (played[pid] || 0) + 1;
        if (s1 > s2) wins[pid] = (wins[pid] || 0) + 1;
        else if (s1 === s2) ties[pid] = (ties[pid] || 0) + 1;
      }
      for (const pid of m.team2) {
        scores[pid] = (scores[pid] || 0) + s2;
        played[pid] = (played[pid] || 0) + 1;
        if (s2 > s1) wins[pid] = (wins[pid] || 0) + 1;
        else if (s1 === s2) ties[pid] = (ties[pid] || 0) + 1;
      }
    }
  }

  return players
    .map((p) => ({
      ...p,
      score: scores[p.id] || 0,
      wins: wins[p.id] || 0,
      ties: ties[p.id] || 0,
      played: played[p.id] || 0,
    }))
    .sort((a, b) => b.wins - a.wins || b.ties - a.ties || b.score - a.score);
}

export function getScoresMap(players, rounds) {
  const scores = {};
  for (const p of players) scores[p.id] = 0;
  for (const round of rounds) {
    for (const m of round.matches) {
      if (!m.played) continue;
      for (const pid of m.team1) scores[pid] = (scores[pid] || 0) + Number(m.score1);
      for (const pid of m.team2) scores[pid] = (scores[pid] || 0) + Number(m.score2);
    }
  }
  return scores;
}
