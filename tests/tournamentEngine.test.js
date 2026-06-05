import { describe, it, expect } from 'vitest';
import { generateAmericanoRounds } from '../src/utils/tournamentEngine.js';

// Build a roster with opaque string ids, mirroring the real { id, name } shape
// produced by Setup.jsx (crypto.randomUUID()). Tests must never assume sequential
// integer ids.
function makeRoster(n) {
  return Array.from({ length: n }, (_, i) => ({ id: `p-${i}`, name: `Player ${i}` }));
}

// Normalize a team (unordered partner pair) to a stable key.
const teamKey = (team) => [...team].sort().join('|');

const collectMatches = (rounds) => rounds.flatMap((r) => r.matches);
const collectTeams = (rounds) => collectMatches(rounds).flatMap((m) => [m.team1, m.team2]);

const presentIds = (round) =>
  new Set(round.matches.flatMap((m) => [...m.team1, ...m.team2]));

describe('generateAmericanoRounds — teams never repeat', () => {
  // Core invariant and regression guard for the n=5 bug (where {1,3} and {2,4}
  // each partnered twice under the old circle method).
  for (let n = 4; n <= 12; n++) {
    it(`never repeats a partnership for ${n} players`, () => {
      const teams = collectTeams(generateAmericanoRounds(makeRoster(n), 2)).map(teamKey);
      expect(new Set(teams).size).toBe(teams.length);
    });
  }
});

describe('generateAmericanoRounds — full partnership coverage', () => {
  // Counts where every possible partner pair fits the schedule: multiples of 4,
  // and odd counts congruent to 1 (mod 4).
  for (const n of [4, 5, 8, 9]) {
    it(`covers every partner pair exactly once for ${n} players`, () => {
      const roster = makeRoster(n);
      const teams = collectTeams(generateAmericanoRounds(roster, 2)).map(teamKey);
      const expected = [];
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          expected.push(teamKey([roster[i].id, roster[j].id]));
        }
      }
      expect(teams.length).toBe(expected.length);
      expect(new Set(teams)).toEqual(new Set(expected));
    });
  }
});

describe('generateAmericanoRounds — bye handling for odd counts', () => {
  it('sits exactly one player out each round for 5 players, each exactly once', () => {
    const roster = makeRoster(5);
    const rounds = generateAmericanoRounds(roster, 2);
    expect(rounds).toHaveLength(5);

    const byeCounts = Object.fromEntries(roster.map((p) => [p.id, 0]));
    for (const round of rounds) {
      const present = presentIds(round);
      expect(present.size).toBe(4); // 5 players − 1 bye
      for (const p of roster) if (!present.has(p.id)) byeCounts[p.id]++;
    }
    // Fair rotation: every player byes exactly once across the schedule.
    expect(Object.values(byeCounts)).toEqual([1, 1, 1, 1, 1]);
  });

  it('sits out a consistent number of players each round for odd counts', () => {
    for (const n of [5, 7, 9, 11]) {
      const rounds = generateAmericanoRounds(makeRoster(n), 2);
      const absences = rounds.map((round) => n - presentIds(round).size);
      expect(new Set(absences).size).toBe(1); // same every round
    }
  });
});

describe('generateAmericanoRounds — match shape', () => {
  for (let n = 4; n <= 12; n++) {
    it(`produces well-formed matches for ${n} players`, () => {
      const roster = makeRoster(n);
      const validIds = new Set(roster.map((p) => p.id));
      for (const m of collectMatches(generateAmericanoRounds(roster, 2))) {
        expect(m.team1).toHaveLength(2);
        expect(m.team2).toHaveLength(2);
        const four = [...m.team1, ...m.team2];
        expect(new Set(four).size).toBe(4); // four distinct players
        for (const id of four) expect(validIds.has(id)).toBe(true); // real ids only, no BYE marker
        expect(m.score1).toBeNull();
        expect(m.score2).toBeNull();
        expect(m.played).toBe(false);
        expect(typeof m.id).toBe('string');
      }
    });
  }
});

describe('generateAmericanoRounds — court assignment', () => {
  it('forms identical teams regardless of court count', () => {
    const roster = makeRoster(8);
    const teamsOf = (rounds) =>
      rounds.map((r) => r.matches.map((m) => [teamKey(m.team1), teamKey(m.team2)]));
    expect(teamsOf(generateAmericanoRounds(roster, 1))).toEqual(
      teamsOf(generateAmericanoRounds(roster, 3))
    );
  });

  it('assigns courts within the configured range', () => {
    const courts = 3;
    for (const m of collectMatches(generateAmericanoRounds(makeRoster(12), courts))) {
      expect(m.court).toBeGreaterThanOrEqual(1);
      expect(m.court).toBeLessThanOrEqual(courts);
    }
  });
});

describe('generateAmericanoRounds — edge inputs', () => {
  it('returns no rounds for fewer than 4 players', () => {
    for (const n of [0, 1, 2, 3]) {
      expect(generateAmericanoRounds(makeRoster(n), 2)).toEqual([]);
    }
  });

  it('produces 3 rounds and 6 unique teams for exactly 4 players', () => {
    const rounds = generateAmericanoRounds(makeRoster(4), 1);
    expect(rounds).toHaveLength(3);
    const teams = collectTeams(rounds).map(teamKey);
    expect(teams).toHaveLength(6);
    expect(new Set(teams).size).toBe(6);
  });
});
