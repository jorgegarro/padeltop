// ─── Americano / Mexicano Tournament Engine ───────────────────────────────

/**
 * Americano: fixed rotation. Every player pairs with every other player
 * exactly once (or as close as possible). Points scored per match add to
 * the individual's total.
 *
 * Mexicano: dynamic pairing. After each round the ranking is used to pair
 * players: rank 1 + rank 4 vs rank 2 + rank 3 within each group of 4.
 */

export function generateAmericanoRounds(players, courts) {
  const n = players.length;
  // We need groups of 4. Pad to multiple of 4 if needed (bye players).
  const rounds = [];
  const ids = players.map((p) => p.id);

  // Use a round-robin pairing algorithm for Americano
  // Each round: split ids into two halves; pair index i with index n-1-i as teams,
  // then rotate all except the first.
  let arr = [...ids];
  const totalRounds = n - 1; // standard round-robin rounds

  for (let r = 0; r < totalRounds; r++) {
    const matches = [];
    const pairs = [];
    for (let i = 0; i < Math.floor(arr.length / 2); i++) {
      pairs.push([arr[i], arr[arr.length - 1 - i]]);
    }
    // Group pairs into matches (2 pairs per match = 4 players per court)
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

    // Rotate: keep arr[0] fixed, rotate the rest
    arr = [arr[0], arr[arr.length - 1], ...arr.slice(1, arr.length - 1)];
  }
  return rounds;
}

export function generateMexicanoRound(players, courts, roundNumber, scores) {
  // Sort players by current score desc
  const ranked = [...players].sort(
    (a, b) => (scores[b.id] || 0) - (scores[a.id] || 0)
  );

  const matches = [];
  // Group into sets of 4: rank 1+4 vs rank 2+3
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
  const played = {};
  for (const p of players) {
    scores[p.id] = 0;
    wins[p.id] = 0;
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
      }
      for (const pid of m.team2) {
        scores[pid] = (scores[pid] || 0) + s2;
        played[pid] = (played[pid] || 0) + 1;
        if (s2 > s1) wins[pid] = (wins[pid] || 0) + 1;
      }
    }
  }

  return players
    .map((p) => ({
      ...p,
      score: scores[p.id] || 0,
      wins: wins[p.id] || 0,
      played: played[p.id] || 0,
    }))
    .sort((a, b) => b.score - a.score || b.wins - a.wins);
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
