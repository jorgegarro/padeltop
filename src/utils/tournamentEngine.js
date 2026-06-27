export function generateAmericanoRounds(players, courts) {
  const ids = players.map((p) => p.id);
  const n = ids.length;

  // Generate all possible partner pairs
  const allPairs = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      allPairs.push([ids[i], ids[j]]);
    }
  }

  const usedPairs = new Set();
  const pairKey = (a, b) => [a, b].sort().join('|');
  const rounds = [];
  const matchesPerRound = Math.floor(n / 4);

  // Keep generating rounds as long as we can fill a full round with unused pairs
  let roundNum = 0;
  while (true) {
    const roundMatches = [];
    const usedInRound = new Set();
    const availablePairs = allPairs.filter(
      ([a, b]) => !usedPairs.has(pairKey(a, b))
    );

    // Greedily pick pairs for this round
    for (const pair of availablePairs) {
      if (roundMatches.length >= matchesPerRound) break;
      const [a, b] = pair;
      if (usedInRound.has(a) || usedInRound.has(b)) continue;

      // Find a second unused pair to form a match against
      const partner2 = availablePairs.find(([c, d]) => {
        if (pairKey(c, d) === pairKey(a, b)) return false;
        if (usedPairs.has(pairKey(c, d))) return false;
        if (usedInRound.has(c) || usedInRound.has(d)) return false;
        if (c === a || c === b || d === a || d === b) return false;
        return true;
      });

      if (!partner2) continue;

      usedInRound.add(a);
      usedInRound.add(b);
      usedInRound.add(partner2[0]);
      usedInRound.add(partner2[1]);
      usedPairs.add(pairKey(a, b));
      usedPairs.add(pairKey(partner2[0], partner2[1]));

      const courtIndex = roundMatches.length % courts;
      roundMatches.push({
        id: `r${roundNum}m${roundMatches.length}`,
        team1: [a, b],
        team2: [partner2[0], partner2[1]],
        court: courtIndex + 1,
        score1: null,
        score2: null,
        played: false,
      });
    }

    if (roundMatches.length === 0) break;
    rounds.push({ round: roundNum + 1, matches: roundMatches });
    roundNum++;
  }

  return rounds;
}

export function generateMexicanoRound(players, courts, roundNumber, scores, usedPairsSet) {
  const ranked = [...players].sort(
    (a, b) => (scores[b.id] || 0) - (scores[a.id] || 0)
  );
  const pairKey = (a, b) => [a, b].sort().join('|');
  const used = usedPairsSet || new Set();
  const matches = [];
  const usedInRound = new Set();

  // Try to pair rank 1+4 vs 2+3 within groups of 4, but avoid repeated partners
  const remaining = [...ranked];

  while (remaining.length >= 4) {
    let matched = false;
    // Try groups from the top of remaining
    for (let i = 0; i < remaining.length - 3 && !matched; i++) {
      for (let j = i + 1; j < remaining.length - 2 && !matched; j++) {
        const t1 = [remaining[i].id, remaining[j].id];
        if (used.has(pairKey(t1[0], t1[1]))) continue;

        for (let k = j + 1; k < remaining.length - 1 && !matched; k++) {
          for (let l = k + 1; l < remaining.length && !matched; l++) {
            const t2 = [remaining[k].id, remaining[l].id];
            if (used.has(pairKey(t2[0], t2[1]))) continue;

            const courtIndex = matches.length % courts;
            matches.push({
              id: `r${roundNumber}m${matches.length}`,
              team1: t1,
              team2: t2,
              court: courtIndex + 1,
              score1: null,
              score2: null,
              played: false,
            });
            used.add(pairKey(t1[0], t1[1]));
            used.add(pairKey(t2[0], t2[1]));
            // Remove these 4 players from remaining
            const usedIds = new Set([remaining[i].id, remaining[j].id, remaining[k].id, remaining[l].id]);
            remaining.splice(0, remaining.length, ...remaining.filter((p) => !usedIds.has(p.id)));
            matched = true;
          }
        }
      }
    }
    if (!matched) break;
  }

  return { round: roundNumber, matches, usedPairs: [...used] };
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

export function getUsedPairsFromRounds(rounds) {
  const pairKey = (a, b) => [a, b].sort().join('|');
  const used = new Set();
  for (const round of rounds) {
    for (const m of round.matches) {
      used.add(pairKey(m.team1[0], m.team1[1]));
      used.add(pairKey(m.team2[0], m.team2[1]));
    }
  }
  return used;
}
