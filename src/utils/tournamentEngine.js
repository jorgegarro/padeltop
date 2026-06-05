// ─── Americano / Mexicano Tournament Engine ───────────────────────────────

/**
 * Americano: fixed rotation. Every player pairs with every other player
 * exactly once (or as close as possible). Points scored per match add to
 * the individual's total.
 *
 * Mexicano: dynamic pairing. After each round the ranking is used to pair
 * players: rank 1 + rank 4 vs rank 2 + rank 3 within each group of 4.
 */

// Sentinel partner used to pad an odd roster to an even size. Whoever the circle
// method pairs with this marker sits out (byes) that round. It must never appear
// in a real match team.
const BYE = Symbol('bye');

export function generateAmericanoRounds(players, courts) {
  const rounds = [];
  const ids = players.map((p) => p.id);

  // Phantom-bye round-robin (circle method). Pad odd rosters to an even size so the
  // rotation's guarantee holds: across all rounds every unordered partner pair occurs
  // exactly once. For odd counts this also makes each player bye exactly once.
  const arr = [...ids];
  if (arr.length % 2 === 1) arr.push(BYE);

  const paddedCount = arr.length;
  const totalRounds = paddedCount - 1;

  for (let r = 0; r < totalRounds; r++) {
    // Form partner pairs by coupling index i with paddedCount-1-i.
    const pairs = [];
    for (let i = 0; i < paddedCount / 2; i++) {
      pairs.push([arr[i], arr[paddedCount - 1 - i]]);
    }

    // Drop any pair containing the BYE marker — those player(s) sit out this round.
    const realPairs = pairs.filter((pair) => !pair.includes(BYE));

    // Group real pairs two-at-a-time into matches (two pairs = four players = one court).
    // A trailing leftover pair (odd number of real pairs, e.g. 6/10 players) also byes.
    const matches = [];
    for (let i = 0; i + 1 < realPairs.length; i += 2) {
      const matchIndex = i / 2;
      const courtIndex = matchIndex % courts;
      matches.push({
        id: `r${r}m${matchIndex}`,
        team1: realPairs[i],
        team2: realPairs[i + 1],
        court: courtIndex + 1,
        score1: null,
        score2: null,
        played: false,
      });
    }
    if (matches.length > 0) rounds.push({ round: r + 1, matches });

    // Rotate: keep arr[0] fixed, rotate the rest.
    arr.splice(1, 0, arr.pop());
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
