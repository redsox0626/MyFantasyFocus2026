import { SEASON_YEAR, defenseName, formatPlayerName, normalizeNflTeam } from "./constants";
import { abbreviateTeamName, nameKey, normalizePersonName } from "./names";
import type { NflState, SleeperUserLookup } from "./types";

const SLEEPER = "https://api.sleeper.app/v1";
// Sleeper's stats/projections endpoints live at the bare api.sleeper.app
// domain, not under /v1 like the rest of this file's calls — these are
// undocumented endpoints that return pre-computed standard/PPR point
// totals per player for a given week (actual stats, or pre-game estimates
// for the projections variant).
const SLEEPER_STATS = "https://api.sleeper.app/stats/nfl";
const SLEEPER_PROJECTIONS = "https://api.sleeper.app/projections/nfl";

export type PlayerPoints = { std: number; ppr: number; passTd: number };

let statsCache: { key: string; at: number; map: Map<string, PlayerPoints> } | null = null;
const STATS_TTL_MS = 1000 * 60; // scores move during live games; keep this short

let projCache: { key: string; at: number; map: Map<string, PlayerPoints> } | null = null;
const PROJ_TTL_MS = 1000 * 60 * 15; // projections barely move once the week is set

async function fetchWeekPoints(base: string, season: string, week: number): Promise<Map<string, PlayerPoints>> {
  const map = new Map<string, PlayerPoints>();
  try {
    const url =
      `${base}/${season}/${week}?season_type=regular` +
      `&position[]=QB&position[]=RB&position[]=WR&position[]=TE&position[]=K&position[]=DEF`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (res.ok) {
      const rows = (await res.json()) as {
        player_id?: string;
        stats?: { pts_std?: number; pts_ppr?: number; pass_td?: number };
      }[];
      for (const row of rows) {
        if (!row.player_id) continue;
        map.set(row.player_id, {
          std: row.stats?.pts_std ?? 0,
          ppr: row.stats?.pts_ppr ?? 0,
          passTd: row.stats?.pass_td ?? 0,
        });
      }
    }
  } catch {
    // Best-effort — an empty map just means cards/matchups render without that number.
  }
  return map;
}

export async function getWeekPlayerPoints(season: string, week: number): Promise<Map<string, PlayerPoints>> {
  const key = `${season}-${week}`;
  if (statsCache && statsCache.key === key && Date.now() - statsCache.at < STATS_TTL_MS) {
    return statsCache.map;
  }
  const map = await fetchWeekPoints(SLEEPER_STATS, season, week);
  statsCache = { key, at: Date.now(), map };
  return map;
}

export async function getWeekPlayerProjections(season: string, week: number): Promise<Map<string, PlayerPoints>> {
  const key = `${season}-${week}`;
  if (projCache && projCache.key === key && Date.now() - projCache.at < PROJ_TTL_MS) {
    return projCache.map;
  }
  const map = await fetchWeekPoints(SLEEPER_PROJECTIONS, season, week);
  projCache = { key, at: Date.now(), map };
  return map;
}

type SleeperPlayer = {
  first_name?: string;
  last_name?: string;
  full_name?: string;
  position?: string;
  team?: string;
  search_full_name?: string;
};

let playerCache: Record<string, SleeperPlayer> | null = null;
let playerCacheAt = 0;
const PLAYER_TTL_MS = 1000 * 60 * 60 * 6;

async function sleeperGet<T>(path: string): Promise<T> {
  const res = await fetch(`${SLEEPER}${path}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Sleeper ${path} failed (${res.status})`);
  }
  return (await res.json()) as T;
}

export async function getNflState(): Promise<NflState> {
  const data = await sleeperGet<{
    week?: number;
    season?: string;
    season_type?: string;
    season_start_date?: string;
    display_week?: number;
  }>("/state/nfl");
  const week = Number(data.week || data.display_week || 1) || 1;
  return {
    week: Math.max(1, week),
    season: String(data.season || SEASON_YEAR),
    seasonType: data.season_type || "regular",
    seasonStartDate: data.season_start_date || `${SEASON_YEAR}-09-09`,
    displayWeek: Number(data.display_week || week),
  };
}

export async function getSleeperPlayers(): Promise<Record<string, SleeperPlayer>> {
  const now = Date.now();
  if (playerCache && now - playerCacheAt < PLAYER_TTL_MS) return playerCache;
  playerCache = await sleeperGet<Record<string, SleeperPlayer>>("/players/nfl");
  playerCacheAt = now;
  return playerCache;
}

export function sleeperPlayerInfo(id: string, dict: Record<string, SleeperPlayer>) {
  const p = dict[id];
  if (!p) {
    const asTeam = dict[id] || Object.values(dict).find((x) => x.position === "DEF" && x.team === id);
    if (!asTeam) {
      return { short: `Player ${id}`, full: `Player ${id}`, position: "UNKNOWN", nflTeam: "FA" };
    }
    const nflTeam = normalizeNflTeam(asTeam.team || id);
    const { full, short } =
      asTeam.position === "DEF"
        ? defenseName(nflTeam)
        : formatPlayerName(asTeam.first_name || "", asTeam.last_name || asTeam.full_name || id);
    return {
      short,
      full,
      position: asTeam.position || "DEF",
      nflTeam,
    };
  }
  const nflTeam = normalizeNflTeam(p.team);
  const { full, short } =
    p.position === "DEF" ? defenseName(nflTeam) : formatPlayerName(p.first_name || "", p.last_name || p.full_name || "");
  return {
    short,
    full,
    position: p.position || "UNKNOWN",
    nflTeam,
  };
}

async function mapPool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const idx = cursor++;
      out[idx] = await fn(items[idx]!);
    }
  }
  const n = Math.min(limit, items.length) || 0;
  await Promise.all(Array.from({ length: n }, () => worker()));
  return out;
}

function sleeperTeamName(user: any, fallback: string): string {
  const meta = user?.metadata || {};
  const named = (meta.team_name || meta.teamName || "").trim();
  return named || (user?.display_name || user?.username || fallback).trim() || fallback;
}

function matchupPoints(matchup: any): number {
  const custom = matchup?.custom_points;
  if (custom != null && custom !== "") {
    const n = Number(custom);
    if (Number.isFinite(n)) return n;
  }
  const n = Number(matchup?.points ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export type SleeperStart = {
  playerId: string;
  fantasyAbbrev: string;
  fantasyName: string;
  matchupId: string;
};

export type SleeperMatchupRow = {
  id: string;
  leagueName: string;
  myTeam: { name: string; abbrev: string; score: number };
  oppTeam: { name: string; abbrev: string; score: number } | null;
};

export type SleeperAccountQuery = {
  username: string;
  leagueIds?: string[] | null;
};

function uniqueAccounts(accounts: SleeperAccountQuery[]): SleeperAccountQuery[] {
  const map = new Map<string, SleeperAccountQuery>();
  for (const account of accounts) {
    const username = account.username.trim().toLowerCase();
    if (!username) continue;
    const prev = map.get(username);
    if (!prev) {
      map.set(username, {
        username,
        leagueIds: account.leagueIds ?? null,
      });
      continue;
    }
    if (account.leagueIds == null) {
      prev.leagueIds = null;
    } else if (prev.leagueIds) {
      prev.leagueIds = [...new Set([...prev.leagueIds, ...account.leagueIds])];
    }
  }
  return [...map.values()];
}

export async function collectSleeperStarts(accounts: SleeperAccountQuery[], week: number, season: string) {
  const myStarts: SleeperStart[] = [];
  const oppStarts: SleeperStart[] = [];
  const matchups: SleeperMatchupRow[] = [];
  const warnings: string[] = [];
  let leaguesUsed = 0;

  for (const account of uniqueAccounts(accounts)) {
    const username = account.username;
    let user: { user_id?: string; username?: string; display_name?: string };
    try {
      user = await sleeperGet(`/user/${encodeURIComponent(username)}`);
    } catch {
      warnings.push(`Sleeper user “${username}” was not found.`);
      continue;
    }
    if (!user?.user_id) {
      warnings.push(`Sleeper user “${username}” was not found.`);
      continue;
    }
    const display = user.username || user.display_name || username;

    let leagues: any[] = [];
    try {
      leagues = await sleeperGet(`/user/${user.user_id}/leagues/nfl/${season}`);
    } catch {
      warnings.push(`Could not load ${season} leagues for ${display}.`);
      continue;
    }
    if (!Array.isArray(leagues) || leagues.length === 0) {
      warnings.push(`${display} has no Sleeper NFL leagues for ${season}.`);
      continue;
    }

    const allow = account.leagueIds;
    const filtered =
      allow == null ? leagues : leagues.filter((league) => allow.includes(String(league.league_id)));
    if (allow != null && filtered.length === 0) {
      warnings.push(`No selected leagues remain for ${display}.`);
      continue;
    }

    const results = await mapPool(filtered, 5, async (league) => {
      try {
        const [rosters, matchupRows, users] = await Promise.all([
          sleeperGet<any[]>(`/league/${league.league_id}/rosters`),
          sleeperGet<any[]>(`/league/${league.league_id}/matchups/${week}`),
          sleeperGet<any[]>(`/league/${league.league_id}/users`).catch(() => []),
        ]);
        const userRoster = rosters.find((r) => r.owner_id === user.user_id);
        if (!userRoster) return null;
        const userMatchup = matchupRows.find((m) => m.roster_id === userRoster.roster_id);
        if (!userMatchup) return null;
        const oppMatchup = matchupRows.find(
          (m) => m.matchup_id === userMatchup.matchup_id && m.roster_id !== userRoster.roster_id,
        );
        const oppRoster = oppMatchup ? rosters.find((r) => r.roster_id === oppMatchup.roster_id) : null;
        const myUser = users.find((u: any) => u.user_id === user.user_id) || user;
        const oppUser = oppRoster ? users.find((u: any) => u.user_id === oppRoster.owner_id) : null;
        const myName = sleeperTeamName(myUser, display);
        const oppName = oppUser ? sleeperTeamName(oppUser, "Opponent") : "Opponent";
        const myAbbrev = abbreviateTeamName(myName);
        const oppAbbrev = abbreviateTeamName(oppName);
        const matchupId = `sleeper:${league.league_id}:${week}`;
        return {
          userMatchup,
          oppMatchup,
          myAbbrev,
          oppAbbrev,
          myName,
          oppName,
          matchupId,
          leagueName: league.name || "Sleeper league",
        };
      } catch {
        return null;
      }
    });

    for (const row of results) {
      if (!row) continue;
      leaguesUsed += 1;
      matchups.push({
        id: row.matchupId,
        leagueName: row.leagueName,
        myTeam: { name: row.myName, abbrev: row.myAbbrev, score: matchupPoints(row.userMatchup) },
        oppTeam: row.oppMatchup
          ? { name: row.oppName, abbrev: row.oppAbbrev, score: matchupPoints(row.oppMatchup) }
          : null,
      });
      for (const pid of row.userMatchup?.starters || []) {
        if (!pid || pid === "0") continue;
        myStarts.push({
          playerId: String(pid),
          fantasyAbbrev: row.myAbbrev,
          fantasyName: row.myName,
          matchupId: row.matchupId,
        });
      }
      if (row.oppMatchup) {
        for (const pid of row.oppMatchup.starters || []) {
          if (!pid || pid === "0") continue;
          oppStarts.push({
            playerId: String(pid),
            fantasyAbbrev: row.oppAbbrev,
            fantasyName: row.oppName,
            matchupId: row.matchupId,
          });
        }
      }
    }
  }

  return { myStarts, oppStarts, matchups, leaguesUsed, warnings };
}

export async function lookupSleeperUser(username: string, season: string): Promise<SleeperUserLookup> {
  const query = username.trim().replace(/^@/, "");
  const empty: SleeperUserLookup = { found: false, query, username: query.toLowerCase(), leagues: [] };
  if (!query) return empty;
  try {
    const user = await sleeperGet<{
      user_id?: string;
      username?: string;
      display_name?: string;
      avatar?: string | null;
    }>(`/user/${encodeURIComponent(query)}`);
    if (!user?.user_id) return empty;
    let leagues: any[] = [];
    try {
      leagues = await sleeperGet(`/user/${user.user_id}/leagues/nfl/${season}`);
    } catch {
      leagues = [];
    }
    return {
      found: true,
      query,
      username: user.username || query,
      userId: String(user.user_id),
      displayName: user.display_name || user.username || query,
      avatar: user.avatar || null,
      leagues: (Array.isArray(leagues) ? leagues : []).map((league) => ({
        id: String(league.league_id),
        name: String(league.name || "League"),
        avatar: league.avatar || null,
        size: Number(league.total_rosters) || 0,
      })),
    };
  } catch {
    return empty;
  }
}

export async function lookupSleeperUsers(usernames: string[], season: string): Promise<SleeperUserLookup[]> {
  const unique = [...new Set(usernames.map((u) => u.trim().replace(/^@/, "")).filter(Boolean))];
  return mapPool(unique.slice(0, 12), 4, (name) => lookupSleeperUser(name, season));
}

/** Best-effort match of an ESPN display name onto a Sleeper player id. */
export function findSleeperIdByName(
  name: string,
  position: string,
  dict: Record<string, SleeperPlayer>,
): string | null {
  const targetKey = nameKey(name);
  const targetNorm = normalizePersonName(name);
  const parts = targetNorm.split(" ").filter(Boolean);
  const first = parts[0] || "";
  const last = parts.slice(1).join(" ");
  const positions =
    position === "FLEX"
      ? ["RB", "WR", "TE"]
      : [position === "DST" || position === "D" ? "DEF" : position];

  if (positions.includes("DEF")) {
    for (const [id, player] of Object.entries(dict)) {
      if (player.position !== "DEF") continue;
      const pn = nameKey(`${player.full_name || ""} ${player.first_name || ""} ${player.last_name || ""} ${player.team || ""}`);
      if (pn && targetKey && (pn.includes(targetKey) || targetKey.includes(pn))) return id;
    }
  }

  let initialFallback: string | null = null;
  for (const [id, player] of Object.entries(dict)) {
    if (!positions.includes(player.position || "")) continue;
    const pFull = `${player.first_name || ""} ${player.last_name || player.full_name || ""}`;
    const pKey = nameKey(pFull);
    if (pKey && targetKey && pKey === targetKey) return id;
    const pNorm = normalizePersonName(pFull);
    const pParts = pNorm.split(" ").filter(Boolean);
    const pFirst = pParts[0] || "";
    const pLast = pParts.slice(1).join(" ");
    if (last && pLast === last && (pFirst === first || pFirst.startsWith(first) || first.startsWith(pFirst))) {
      return id;
    }
    if (last && pLast === last && first[0] && pFirst[0] === first[0]) {
      initialFallback = initialFallback || id;
    }
  }
  return initialFallback;
}
